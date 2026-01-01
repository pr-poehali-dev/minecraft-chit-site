"""
API для управления админ панелью - авторизация, CRUD настроек и продуктов
"""
import json
import os
import psycopg2
import hashlib
import secrets
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    try:
        if method == 'POST' and path == 'login':
            return admin_login(event)
        elif method == 'POST' and path == 'create-admin':
            return create_admin(event)
        elif method == 'GET' and path == 'settings':
            return get_settings(event)
        elif method == 'PUT' and path == 'settings':
            return update_settings(event)
        elif method == 'GET' and path == 'products':
            return get_products(event)
        elif method == 'POST' and path == 'products':
            return create_product(event)
        elif method == 'PUT' and path == 'products':
            return update_product(event)
        elif method == 'DELETE' and path == 'products':
            return delete_product(event)
        else:
            return error_response('Invalid action', 400)
    except Exception as e:
        return error_response(str(e), 500)

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_token(event: dict) -> bool:
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    token = auth_header.replace('Bearer ', '')
    return len(token) == 64

def admin_login(event: dict) -> dict:
    data = json.loads(event.get('body', '{}'))
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return error_response('Username and password required', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    password_hash = hash_password(password)
    cur.execute(
        "SELECT id FROM admin_users WHERE username = %s AND password_hash = %s",
        (username, password_hash)
    )
    
    admin = cur.fetchone()
    cur.close()
    conn.close()
    
    if not admin:
        return error_response('Invalid credentials', 401)
    
    token = secrets.token_hex(32)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'token': token,
            'username': username
        }),
        'isBase64Encoded': False
    }

def create_admin(event: dict) -> dict:
    data = json.loads(event.get('body', '{}'))
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return error_response('Username and password required', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    password_hash = hash_password(password)
    
    try:
        cur.execute(
            "INSERT INTO admin_users (username, password_hash) VALUES (%s, %s) RETURNING id",
            (username, password_hash)
        )
        admin_id = cur.fetchone()[0]
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'admin_id': admin_id
            }),
            'isBase64Encoded': False
        }
    except psycopg2.IntegrityError:
        return error_response('Admin already exists', 400)
    finally:
        cur.close()
        conn.close()

def get_settings(event: dict) -> dict:
    if not verify_token(event):
        return error_response('Unauthorized', 401)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT setting_key, setting_value, setting_type FROM site_settings")
    rows = cur.fetchall()
    
    settings = {}
    for row in rows:
        settings[row[0]] = {
            'value': row[1],
            'type': row[2]
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(settings),
        'isBase64Encoded': False
    }

def update_settings(event: dict) -> dict:
    if not verify_token(event):
        return error_response('Unauthorized', 401)
    
    data = json.loads(event.get('body', '{}'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    for key, value in data.items():
        cur.execute(
            "UPDATE site_settings SET setting_value = %s, updated_at = CURRENT_TIMESTAMP WHERE setting_key = %s",
            (value, key)
        )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def get_products(event: dict) -> dict:
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, name, price, duration, features, badge, is_popular, is_active
        FROM products
        ORDER BY is_popular DESC, price ASC
    """)
    
    rows = cur.fetchall()
    products = []
    
    for row in rows:
        products.append({
            'id': row[0],
            'name': row[1],
            'price': float(row[2]),
            'duration': row[3],
            'features': row[4],
            'badge': row[5],
            'is_popular': row[6],
            'is_active': row[7]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(products),
        'isBase64Encoded': False
    }

def create_product(event: dict) -> dict:
    if not verify_token(event):
        return error_response('Unauthorized', 401)
    
    data = json.loads(event.get('body', '{}'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO products (name, price, duration, features, badge, is_popular, is_active)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        data['name'],
        data['price'],
        data.get('duration', 'Навсегда'),
        data.get('features', []),
        data.get('badge'),
        data.get('is_popular', False),
        data.get('is_active', True)
    ))
    
    product_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True, 'id': product_id}),
        'isBase64Encoded': False
    }

def update_product(event: dict) -> dict:
    if not verify_token(event):
        return error_response('Unauthorized', 401)
    
    data = json.loads(event.get('body', '{}'))
    product_id = event.get('queryStringParameters', {}).get('id')
    
    if not product_id:
        return error_response('Product ID required', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        UPDATE products
        SET name = %s, price = %s, duration = %s, features = %s, 
            badge = %s, is_popular = %s, is_active = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """, (
        data['name'],
        data['price'],
        data['duration'],
        data['features'],
        data.get('badge'),
        data.get('is_popular', False),
        data.get('is_active', True),
        product_id
    ))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def delete_product(event: dict) -> dict:
    if not verify_token(event):
        return error_response('Unauthorized', 401)
    
    product_id = event.get('queryStringParameters', {}).get('id')
    
    if not product_id:
        return error_response('Product ID required', 400)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("UPDATE products SET is_active = false WHERE id = %s", (product_id,))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def error_response(message: str, status_code: int) -> dict:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }
