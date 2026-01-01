import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const features = [
    {
      icon: 'Zap',
      title: 'KillAura',
      description: 'Автоматическая атака ближайших мобов и игроков с настраиваемым радиусом'
    },
    {
      icon: 'Eye',
      title: 'ESP/Wallhack',
      description: 'Видите игроков и мобов сквозь стены, подсветка сундуков и руды'
    },
    {
      icon: 'Rocket',
      title: 'Fly & Speed',
      description: 'Полёт в креативе и ускоренное передвижение на любом сервере'
    },
    {
      icon: 'Shield',
      title: 'AntiKnockback',
      description: 'Защита от отбрасывания при ударах, стабильный PVP'
    },
    {
      icon: 'Box',
      title: 'X-Ray',
      description: 'Прозрачные блоки для поиска алмазов и ценных ресурсов'
    },
    {
      icon: 'Target',
      title: 'Aimbot',
      description: 'Автоматическое наведение на цели для точных ударов'
    }
  ];

  const faqs = [
    {
      question: 'С какими версиями Minecraft совместим чит?',
      answer: 'Lirider.fun поддерживает версии Minecraft 1.8.9, 1.12.2, 1.16.5, 1.19.4 и 1.20.x. Работает как на лицензионных, так и на пиратских клиентах.'
    },
    {
      question: 'Как установить Lirider.fun?',
      answer: 'Скачайте файл чита с нашего сайта, запустите установщик, выберите папку Minecraft. После установки запустите лаунчер и выберите профиль Lirider. Готово!'
    },
    {
      question: 'Безопасно ли использовать чит?',
      answer: 'Lirider.fun использует продвинутые методы обхода античитов, но помните: использование читов может привести к бану на серверах. Мы рекомендуем использовать на приватных или анархия серверах.'
    },
    {
      question: 'Обнаруживают ли античиты Lirider.fun?',
      answer: 'Мы регулярно обновляем обход популярных античитов (Vulcan, Grim, Spartan, Verus). Однако 100% защиты не существует. Используйте настройки "legit mode" для снижения риска.'
    },
    {
      question: 'Могу ли я настроить функции чита?',
      answer: 'Да! Lirider.fun имеет продвинутое меню настроек (клавиша RShift). Вы можете настроить каждую функцию: радиус, скорость, задержки, включить/выключить модули.'
    },
    {
      question: 'Есть ли техподдержка?',
      answer: 'Да, наша команда всегда на связи в Discord и Telegram. Время ответа обычно до 2 часов. Также есть wiki с подробными инструкциями.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-sm border-b-4 border-primary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center text-2xl">
              🎮
            </div>
            <h1 className="text-2xl font-bold text-primary">Lirider.fun</h1>
          </div>
          <div className="hidden md:flex gap-6">
            <Button 
              variant={activeSection === 'home' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('home')}
              className="text-lg"
            >
              Главная
            </Button>
            <Button 
              variant={activeSection === 'features' ? 'default' : 'ghost'}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg"
            >
              Возможности
            </Button>
            <Button 
              variant={activeSection === 'faq' ? 'default' : 'ghost'}
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg"
            >
              FAQ
            </Button>
            <Button 
              variant={activeSection === 'support' ? 'default' : 'ghost'}
              onClick={() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg"
            >
              Поддержка
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-6xl md:text-8xl font-bold text-primary mb-4 drop-shadow-lg">
              LIRIDER.FUN
            </h2>
            <p className="text-2xl md:text-3xl text-secondary mb-8">
              Легендарный чит для Minecraft
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-xl px-8 py-6 bg-primary hover:bg-primary/90 border-4 border-primary-foreground/20">
              <Icon name="Download" className="mr-2" size={24} />
              Скачать чит
            </Button>
            <Button size="lg" variant="outline" className="text-xl px-8 py-6 border-4">
              <Icon name="Youtube" className="mr-2" size={24} />
              Видео обзор
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card border-4 border-primary/30 hover:border-primary transition-all">
              <CardHeader>
                <Icon name="Users" className="mx-auto mb-2" size={48} />
                <CardTitle className="text-2xl">50K+</CardTitle>
                <CardDescription className="text-lg">Активных игроков</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-4 border-primary/30 hover:border-primary transition-all">
              <CardHeader>
                <Icon name="Star" className="mx-auto mb-2" size={48} />
                <CardTitle className="text-2xl">4.9/5</CardTitle>
                <CardDescription className="text-lg">Рейтинг пользователей</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-4 border-primary/30 hover:border-primary transition-all">
              <CardHeader>
                <Icon name="Shield" className="mx-auto mb-2" size={48} />
                <CardTitle className="text-2xl">100%</CardTitle>
                <CardDescription className="text-lg">Обход античитов</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-5xl font-bold text-center mb-12 text-primary">
            Возможности чита
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-card border-4 border-primary/20 hover:border-secondary hover:scale-105 transition-all cursor-pointer"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-sm flex items-center justify-center mb-4 mx-auto">
                    <Icon name={feature.icon as any} size={32} className="text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-5xl font-bold text-center mb-12 text-primary">
            Вопросы и ответы
          </h3>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border-4 border-primary/20 rounded-none px-6"
              >
                <AccordionTrigger className="text-xl font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground pt-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="support" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-5xl font-bold mb-8 text-primary">
            Поддержка
          </h3>
          <p className="text-xl mb-12 text-muted-foreground">
            Нужна помощь? Наша команда всегда на связи!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-4 border-primary/30 hover:border-secondary transition-all cursor-pointer">
              <CardHeader>
                <Icon name="MessageCircle" className="mx-auto mb-4" size={48} />
                <CardTitle className="text-2xl">Discord</CardTitle>
                <CardDescription className="text-lg">
                  Присоединяйся к нашему серверу
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full border-2">
                  Открыть Discord
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-card border-4 border-primary/30 hover:border-secondary transition-all cursor-pointer">
              <CardHeader>
                <Icon name="Send" className="mx-auto mb-4" size={48} />
                <CardTitle className="text-2xl">Telegram</CardTitle>
                <CardDescription className="text-lg">
                  Быстрая поддержка в мессенджере
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full border-2">
                  Написать в Telegram
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-card border-4 border-primary/30 hover:border-secondary transition-all cursor-pointer">
              <CardHeader>
                <Icon name="BookOpen" className="mx-auto mb-4" size={48} />
                <CardTitle className="text-2xl">Wiki</CardTitle>
                <CardDescription className="text-lg">
                  База знаний и инструкции
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full border-2">
                  Открыть Wiki
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t-4 border-primary/30">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-lg">
            © 2024 Lirider.fun - Лучший чит для Minecraft
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Использование читов может привести к бану. Используйте на свой риск.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
