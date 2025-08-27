interface FeaturedGridProps { lang: 'ar' | 'en'; }

const data = [
  { name: 'سارة', role: 'مصممة UI/UX', rating: 4.9 },
  { name: 'علي', role: 'مطور واجهات', rating: 4.8 },
  { name: 'منى', role: 'كاتبة محتوى', rating: 4.7 },
  { name: 'خالد', role: 'مسوّق رقمي', rating: 4.6 },
];

const dataEn = [
  { name: 'Sara', role: 'UI/UX Designer', rating: 4.9 },
  { name: 'Ali', role: 'Frontend Dev', rating: 4.8 },
  { name: 'Mona', role: 'Content Writer', rating: 4.7 },
  { name: 'Khaled', role: 'Digital Marketer', rating: 4.6 },
];

const FeaturedGrid = ({ lang }: FeaturedGridProps) => {
  const t = {
    ar: { title: 'مستقلون مميزون', items: data },
    en: { title: 'Featured Freelancers', items: dataEn },
  }[lang];

  return (
    <section className="container py-16">
      <h2 className="text-2xl font-bold mb-8">{t.title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.items.map((p, i) => (
          <div key={i} className="rounded-lg border border-border/60 bg-card/60 p-5 hover-glow">
            <div className="h-12 w-12 rounded-full bg-secondary/60 border border-border/60 mb-3" aria-label={p.name} />
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-muted-foreground">{p.role}</div>
            <div className="mt-2 text-primary text-sm">⭐ {p.rating}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGrid;
