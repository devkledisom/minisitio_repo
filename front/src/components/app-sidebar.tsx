import { useContext, useEffect, useState } from "react"
import { AuthContext } from '../context/AuthContext.js';
import { BookOpen, Briefcase, Building2, Calendar, ChartNoAxesCombined, ChevronDown, ChevronUp, DollarSign, Home, Inbox, Newspaper, Search, Settings, Star, Ticket, Tickets, User2, Users } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu.tsx"
import { Separator } from "../components/ui/separator.tsx"
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";


const items = [
    {
        title: "Home",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Usuários",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Cadernos",
        url: "/admin/cadernos",
        icon: BookOpen,
    },
    {
        title: "Atividades",
        url: "/admin/atividades",
        icon: Briefcase,
    },
    {
        title: "Espaços",
        url: "/admin/espacos",
        icon: Newspaper,
    },
    {
        title: "Gerenciar IDs",
        url: "/admin/desconto",
        icon: Tickets,
    },
    {
        title: "Pagamentos",
        url: "/admin/pagamentos",
        icon: DollarSign,
    },
    {
        title: "PINs",
        url: "/admin/pin",
        icon: Star,
    },
    {
        title: "Campanha",
        url: "/admin/campanha",
        icon: ChartNoAxesCombined,
    },
    {
        title: "Configuração",
        url: "/admin/configuracoes",
        icon: Settings,
    },
]

export function AppSidebar() {
    const { user } = useContext(AuthContext);
    const [userLoggedName, setUserLoggedName] = useState();

    useEffect(() => {
        if (user) {
            setUserLoggedName(user.descNome);
        }
    }, [user]);

    function sair() {
        sessionStorage.removeItem('authTokenMN');
        sessionStorage.removeItem('userLogged');
        sessionStorage.removeItem('userTokenAccess');

        window.location.href = '/login';
    };

    return (
        <Sidebar className="bg-sidebar text-sidebar-foreground w-64 bg-dark ">
            <SidebarContent>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <img src="/assets/img/logo.png" width={50} alt="Minisitio Logo" />
                        <h6 className="font-bold text-white m-0">MINISITIO</h6>
                    </div>
                </SidebarHeader>
                <Separator className="bg-[var(--muted-foreground)]" />
                <SidebarGroup>
                    {/*       <SidebarGroupLabel className="text-white">
                          modulos
                    </SidebarGroupLabel> 
                    <Separator className="bg-[var(--muted-foreground)]"/>*/}
                    <SidebarGroupContent>
                        <SidebarMenu className="p-0">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className="" asChild>
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-2 p-2 rounded-md text-white
                 hover:bg-sky-700 hover:text-white
                 transition-colors duration-150 no-underline"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {/*  <Separator className="bg-[var(--muted-foreground)]"/> */}
            <SidebarFooter className="bg-sidebar text-sidebar-foreground">
                {/*  <SidebarMenu className="p-0">
                    <SidebarMenuItem>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center justify-between w-full text-white p-2 rounded-md hover:bg-sky-700 transition-colors duration-150">
                                <SidebarMenuButton asChild>
                                    <span className="flex items-center gap-2">
                                        <User2 className="w-5 h-5" /> {userLoggedName}
                                    <ChevronUp className="ml-auto w-4 h-4" />
                                    </span>
                                    
                                </SidebarMenuButton>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="bg-white text-sidebar-foreground"
                            >
                                <DropdownMenuItem asChild>
                                    <Link to="/login" onClick={sair}>Sair</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
 */}

                <Dropdown className="w-100">
                    <Dropdown.Toggle
                        variant="primary"
                        className="flex items-center justify-between w-full !text-white p-2 rounded-md hover:bg-sky-700 transition-colors duration-150"
                    >
                        <span className="flex items-center gap-2 w-full">
                            <User2 className="w-5 h-5" />
                            {userLoggedName}
                            <ChevronUp className="ml-auto w-4 h-4" />
                        </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-full">
                        <Dropdown.Item as="button" onClick={sair}>
                            Sair
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>



            </SidebarFooter>
        </Sidebar>

    )
}