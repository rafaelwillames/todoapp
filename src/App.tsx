import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container flex items-center justify-between py-6">
        <h1 className="text-xl font-semibold">TodoAPP</h1>
        <ModeToggle />
      </header>
      <main className="container flex flex-col items-center gap-4 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          shadcn/ui is configured
        </h2>
        <p className="max-w-md text-muted-foreground">
          Light and dark themes are wired up through the ThemeProvider. Use the
          toggle in the header to switch between them.
        </p>
        <Button>Primary action</Button>
      </main>
    </div>
  )
}

export default App
