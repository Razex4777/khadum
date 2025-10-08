import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus, Calculator, Search } from "lucide-react";

const HeroEnhanced = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(5000);
  const [projectType, setProjectType] = useState("web-dev");
  const [duration, setDuration] = useState(2);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const t = {
    title: "خدوم — منصة المستقلين الذكية",
    subtitle: "احسب تكلفة مشروعك أو ابحث عن المستقل المناسب فورًا",
    cta1: "انضم كمستقل",
    cta2: "ابدأ مع واتساب",
    calcTab: "حاسبة التكلفة",
    searchTab: "ابحث عن مستقل",
    budgetLabel: "الميزانية المتوقعة",
    projectTypeLabel: "نوع المشروع",
    durationLabel: "المدة المتوقعة (أسابيع)",
    projectTypes: {
      "web-dev": "تطوير ويب",
      "mobile-app": "تطبيق موبايل",
      "design": "تصميم جرافيك",
      "content": "كتابة محتوى",
      "marketing": "تسويق رقمي",
    },
    estimatedLabel: "التكلفة المتوقعة",
    skillsLabel: "المهارات المطلوبة",
    skillsPlaceholder: "مثل: React, Node.js, Design",
    findBtn: "ابحث الآن",
    calculateBtn: "احسب التكلفة",
    sar: "ر.س",
  };

  useEffect(() => {
    // Simple calculation logic
    const baseRates: Record<string, number> = {
      "web-dev": 300,
      "mobile-app": 350,
      "design": 200,
      "content": 150,
      "marketing": 250,
    };
    const rate = baseRates[projectType] || 250;
    const calculated = rate * duration * 5; // 5 days per week
    setEstimatedCost(calculated);
  }, [projectType, duration]);

  const handleWhatsAppClick = () => {
    const phoneNumber = '+966509811981';
    const message = encodeURIComponent('مرحبا، أريد البدء مع خدوم');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleFreelancerJoin = () => {
    navigate('/authentication/register');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary-dark))] via-[hsl(var(--primary))] to-[hsl(var(--primary-light))] text-white pt-24 md:pt-28">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
      
      <div className="container relative py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Title & CTAs */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-prose">
              {t.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg"
                className="gap-2 bg-white text-[hsl(var(--primary))] hover:bg-white/90 hover-lift shadow-xl"
                onClick={handleFreelancerJoin}
              >
                <UserPlus className="w-5 h-5" />
                {t.cta1}
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover-lift backdrop-blur-sm"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="w-5 h-5" />
                {t.cta2}
              </Button>
            </div>
          </div>

          {/* Right: Interactive Calculator with Background */}
          <Card className="shadow-2xl border-0 overflow-hidden animate-slide-up relative">
            {/* SVG Background Pattern */}
            <div className="absolute inset-0 opacity-100">
              <img
                src="/hero/khadum-hero-bg.svg"
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            
            {/* Glass overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-primary-ultra-light/80 backdrop-blur-sm" />
            
            <Tabs defaultValue="calculator" className="w-full relative z-10">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="calculator" className="gap-2">
                  <Calculator className="w-4 h-4" />
                  {t.calcTab}
                </TabsTrigger>
                <TabsTrigger value="search" className="gap-2">
                  <Search className="w-4 h-4" />
                  {t.searchTab}
                </TabsTrigger>
              </TabsList>

              {/* Calculator Tab */}
              <TabsContent value="calculator" className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="project-type">{t.projectTypeLabel}</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="project-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.projectTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">
                    {t.durationLabel}: {duration} {lang === 'ar' ? 'أسابيع' : 'weeks'}
                  </Label>
                  <Slider
                    id="duration"
                    min={1}
                    max={12}
                    step={1}
                    value={[duration]}
                    onValueChange={(v) => setDuration(v[0])}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">
                    {t.budgetLabel}: {budget.toLocaleString()} {t.sar}
                  </Label>
                  <Slider
                    id="budget"
                    min={1000}
                    max={50000}
                    step={500}
                    value={[budget]}
                    onValueChange={(v) => setBudget(v[0])}
                    className="py-2"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-sm text-muted-foreground">{t.estimatedLabel}</span>
                    <div className="text-3xl font-bold text-primary">
                      {estimatedCost.toLocaleString()} <span className="text-lg">{t.sar}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full gap-2 hover-lift" 
                    size="lg"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t.calculateBtn}
                  </Button>
                </div>
              </TabsContent>

              {/* Search Tab */}
              <TabsContent value="search" className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="project-type-search">{t.projectTypeLabel}</Label>
                  <Select defaultValue="web-dev">
                    <SelectTrigger id="project-type-search">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.projectTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">{t.skillsLabel}</Label>
                  <Input
                    id="skills"
                    placeholder={t.skillsPlaceholder}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget-search">
                    {t.budgetLabel}: {budget.toLocaleString()} {t.sar}
                  </Label>
                  <Slider
                    id="budget-search"
                    min={1000}
                    max={50000}
                    step={500}
                    value={[budget]}
                    onValueChange={(v) => setBudget(v[0])}
                    className="py-2"
                  />
                </div>

                <Button 
                  className="w-full gap-2 hover-lift" 
                  size="lg"
                  onClick={handleFreelancerJoin}
                >
                  <Search className="w-4 h-4" />
                  {t.findBtn}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroEnhanced;
