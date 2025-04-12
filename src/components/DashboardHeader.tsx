import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Settings, Shield } from "lucide-react"

export function DashboardHeader() {
  
  return (
    <header className="border-b border-border bg-card h-16 flex items-center px-3 md:px-6 sticky top-0 z-50">
      <div className="flex gap-2 items-center w-full max-w-screen-2xl mx-auto">
        <SidebarTrigger />
        
        <Link to="/dashboard" className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center gap-3">
            <Label className="text-xl md:text-2xl font-semibold text-white">
              voltz
              <span className="text-primary">.checkout</span>
            </Label>
          </div>
        </Link>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Add Admin Panel Link - discreet, only visible to those who know */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/configuracoes/gerais">Gerais</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/configuracoes/dominios">Domínios</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/configuracoes/logistica">Logística</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/configuracoes/webhooks">Webhooks</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/login" className="text-[#10B981]">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
