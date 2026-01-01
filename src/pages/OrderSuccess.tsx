import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-4 border-primary text-center">
        <CardHeader>
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Check" size={48} className="text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">Спасибо за покупку!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Ваш платёж успешно обработан. Чит отправлен на вашу почту.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/')} size="lg" className="w-full">
              <Icon name="Home" className="mr-2" size={20} />
              На главную
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://discord.gg/D35XpAJcrC', '_blank')}
              size="lg"
              className="w-full"
            >
              <Icon name="MessageCircle" className="mr-2" size={20} />
              Поддержка в Discord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
