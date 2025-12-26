export function NotAllowed() {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <img src="/images/mytalk/cadeado.png" alt="Cadeado amarelo" loading="lazy" width={150} height={150} />
      <h1 className="text-lg font-medium">Você não tem permissão para acessar esta funcionalidade</h1>
      <p className="text-sm text-muted-foreground">Contate um administrador para mais informações</p>
    </section>
  )
}
