CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'text',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(100),
    features TEXT[],
    badge VARCHAR(100),
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
    ('primary_color', '270 60% 60%', 'color'),
    ('secondary_color', '280 50% 50%', 'color'),
    ('background_color', '270 30% 10%', 'color'),
    ('discord_url', 'https://discord.gg/D35XpAJcrC', 'url'),
    ('telegram_url', 'https://t.me/liriderclient', 'url'),
    ('youtube_video_id', 'qKVt_5_j3fw', 'text');

INSERT INTO products (name, price, duration, features, badge, is_popular) VALUES
    ('Обычная', 500.00, 'Навсегда', ARRAY['Основные функции', 'KillAura', 'ESP', 'Стандартная поддержка', 'Обновления'], NULL, false),
    ('Beta', 700.00, 'Навсегда', ARRAY['Создание кастомного цвета', 'KillAura', 'ESP', 'Fly', 'X-Ray'], NULL, false),
    ('Dev', 1000.00, 'Навсегда', ARRAY['Все функции Beta', 'Приоритетная поддержка', 'Обновления', 'Без рекламы', 'Обход всех античитов', 'AntiKnockback'], 'Популярный', true);

CREATE INDEX idx_cart_session ON cart_items(session_id);
CREATE INDEX idx_products_active ON products(is_active);