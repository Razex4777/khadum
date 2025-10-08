
const data = [
  { name: 'مصمم 1', role: 'مصمم UI/UX', rating: 4.9 },
  { name: 'مطور 1', role: 'مطور واجهات', rating: 4.8 },
  { name: 'كاتب 1', role: 'كاتب محتوى', rating: 4.7 },
  { name: 'مسوق 1', role: 'مسوّق رقمي', rating: 4.6 },
];

const dataEn = [
  { name: 'Designer 1', role: 'UI/UX Designer', rating: 4.9 },
  { name: 'Developer 1', role: 'Frontend Dev', rating: 4.8 },
  { name: 'Writer 1', role: 'Content Writer', rating: 4.7 },
  { name: 'Marketer 1', role: 'Digital Marketer', rating: 4.6 },
];

const FeaturedGrid = () => {
  const t = {
    title: 'مستقلون مميزون',
    items: data
  };

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
