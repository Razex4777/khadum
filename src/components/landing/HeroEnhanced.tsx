import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus, Calculator, Search, Sparkles, TrendingUp, Shield } from "lucide-react";

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
    trustBadge1: "آمن و موثوق",
    trustBadge2: "أكثر من 500 مستقل",
    trustBadge3: "استجابة فورية",
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary-dark))] via-[hsl(var(--primary))] to-[hsl(var(--primary-light))] text-white pt-24 md:pt-28 min-h-[92vh] flex items-center">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA0IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />
        
        {/* Multi-layered Floating Orbs with Enhanced Animations */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-20 w-96 h-96 bg-gradient-to-tr from-[#25D366]/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-bl from-primary-light/20 to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 right-10 w-64 h-64 bg-gradient-to-tl from-[#d4af37]/10 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s', animationDuration: '9s' }} />
        
        {/* Subtle Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
      
      <div className="container relative py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Enhanced Title & CTAs */}
          <div className="space-y-8 animate-fade-in">
            {/* Main Heading with Gradient Text */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
                <span className="block bg-gradient-to-l from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-lg">
                  {t.title}
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-prose leading-relaxed font-medium">
                {t.subtitle}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <Shield className="w-4 h-4 text-[#25D366]" />
                <span className="font-medium">{t.trustBadge1}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                <span className="font-medium">{t.trustBadge2}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="font-medium">{t.trustBadge3}</span>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="group gap-2 bg-white text-[hsl(var(--primary))] hover:bg-white/95 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={handleFreelancerJoin}
              >
                <UserPlus className="w-5 h-5 transition-transform group-hover:rotate-12" />
                {t.cta1}
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="group gap-2 border-2 border-[#25D366]/50 bg-gradient-to-r from-[#25D366]/20 to-[#128C7E]/20 text-white hover:from-[#25D366] hover:to-[#128C7E] hover:border-[#25D366] backdrop-blur-md shadow-lg hover:shadow-[#25D366]/30 transition-all duration-300 hover:scale-105 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={handleWhatsAppClick}
              >
                <img 
                  src="/whatsapp-logo.svg" 
                  alt="WhatsApp" 
                  className="w-5 h-5 brightness-0 invert transition-transform group-hover:rotate-12"
                />
                {t.cta2}
              </Button>
            </div>
          </div>

          {/* Right: Enhanced Interactive Calculator Card */}
          <Card className="shadow-2xl border-0 overflow-hidden animate-slide-up relative backdrop-blur-xl bg-white/95 rounded-2xl hover:shadow-3xl transition-shadow duration-500">
            {/* Decorative SVG Background (Subtle) */}
            <div className="absolute inset-0 opacity-5">
              <img
                src="/hero/khadum-hero-bg.svg"
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-primary-ultra-light/30 to-[#25D366]/10 backdrop-blur-sm" />
            
            <Tabs defaultValue="calculator" className="w-full relative z-10">
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-muted to-muted/80 p-1 rounded-t-2xl">
                <TabsTrigger 
                  value="calculator" 
                  className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg"
                >
                  <Calculator className="w-4 h-4" />
                  <span className="font-semibold">{t.calcTab}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="search" 
                  className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg"
                >
                  <Search className="w-4 h-4" />
                  <span className="font-semibold">{t.searchTab}</span>
                </TabsTrigger>
              </TabsList>

              {/* Calculator Tab */}
              <TabsContent value="calculator" className="p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="project-type" className="text-base font-semibold text-foreground/90">
                    {t.projectTypeLabel}
                  </Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="project-type" className="h-12 border-2 hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.projectTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-base">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="duration" className="text-base font-semibold text-foreground/90">
                    {t.durationLabel}: <span className="text-primary font-bold">{duration}</span> أسابيع
                  </Label>
                  <Slider
                    id="duration"
                    min={1}
                    max={12}
                    step={1}
                    value={[duration]}
                    onValueChange={(v) => setDuration(v[0])}
                    className="py-3 cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="budget" className="text-base font-semibold text-foreground/90">
                    {t.budgetLabel}: <span className="text-primary font-bold">{budget.toLocaleString()}</span> {t.sar}
                  </Label>
                  <Slider
                    id="budget"
                    min={1000}
                    max={50000}
                    step={500}
                    value={[budget]}
                    onValueChange={(v) => setBudget(v[0])}
                    className="py-3 cursor-pointer"
                  />
                </div>

                {/* Enhanced Result Display */}
                <div className="pt-6 border-t-2 border-primary/10">
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-6 mb-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{t.estimatedLabel}</span>
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-primary">
                      {estimatedCost.toLocaleString()}
                      <span className="text-xl md:text-2xl font-bold mr-2">{t.sar}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full gap-3 h-14 text-lg font-bold bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1ea952] hover:to-[#0e6d5f] shadow-lg hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 hover:scale-[1.02] rounded-xl group" 
                    size="lg"
                    onClick={handleWhatsAppClick}
                  >
                    <img 
                      src="/whatsapp-logo.svg" 
                      alt="WhatsApp" 
                      className="w-5 h-5 brightness-0 invert group-hover:rotate-12 transition-transform"
                    />
                    {t.calculateBtn}
                  </Button>
                </div>
              </TabsContent>

              {/* Search Tab */}
              <TabsContent value="search" className="p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="project-type-search" className="text-base font-semibold text-foreground/90">
                    {t.projectTypeLabel}
                  </Label>
                  <Select defaultValue="web-dev">
                    <SelectTrigger id="project-type-search" className="h-12 border-2 hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.projectTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-base">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="skills" className="text-base font-semibold text-foreground/90">
                    {t.skillsLabel}
                  </Label>
                  <Input
                    id="skills"
                    placeholder={t.skillsPlaceholder}
                    className="h-12 border-2 hover:border-primary/50 focus:border-primary transition-colors text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="budget-search" className="text-base font-semibold text-foreground/90">
                    {t.budgetLabel}: <span className="text-primary font-bold">{budget.toLocaleString()}</span> {t.sar}
                  </Label>
                  <Slider
                    id="budget-search"
                    min={1000}
                    max={50000}
                    step={500}
                    value={[budget]}
                    onValueChange={(v) => setBudget(v[0])}
                    className="py-3 cursor-pointer"
                  />
                </div>

                <Button 
                  className="w-full gap-3 h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl group" 
                  size="lg"
                  onClick={handleFreelancerJoin}
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {t.findBtn}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" fillOpacity="0.05"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroEnhanced;
