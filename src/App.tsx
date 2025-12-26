import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { PricingProvider } from "@/contexts/PricingContext";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import Index from "./pages/Index";
import LeadsPage from "./pages/LeadsPage";
import VendorsPage from "./pages/VendorsPage";
import VerticalPage from "./pages/VerticalPage";
import TeamPage from "./pages/TeamPage";
import UserViewPage from "./pages/UserViewPage";
import MarketplacePage from "./pages/MarketplacePage";
import AccountsPage from "./pages/AccountsPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import DataImportPage from "./pages/DataImportPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CurrentUserProvider>
        <PricingProvider>
          <MarketplaceProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/verticals/:verticalId" element={<VerticalPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/user-access" element={<UserViewPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/data-import" element={<DataImportPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </MarketplaceProvider>
        </PricingProvider>
      </CurrentUserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
