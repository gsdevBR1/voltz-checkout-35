
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatDateTime } from "@/lib/utils";
import { Globe, Instagram, MousePointer, MapPin, HelpCircle, Smartphone } from "lucide-react";

// Mock data for lead origin
const MOCK_ORIGIN = {
  firstVisit: "2025-04-11T17:30:00",
  utmSource: "instagram",
  utmMedium: "cpc",
  utmCampaign: "relampago-insta",
  device: "Mobile",
  location: "Rio de Janeiro - RJ",
  browser: "Chrome",
  os: "Android"
};

interface LeadOriginInfoProps {
  leadId: string;
}

const LeadOriginInfo: React.FC<LeadOriginInfoProps> = ({ leadId }) => {
  // Helper function to get the source icon
  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" /></svg>;
      case 'google':
        return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 11h8.6c.1.4.2.8.2 1.3 0 5-3.3 8.7-8.6 8.7-5 0-9-4-9-9s4-9 9-9c2.4 0 4.5 1 6.1 2.5L16 7.8a4.9 4.9 0 1 0 0 6.2z" /></svg>;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Globe className="h-5 w-5 text-primary" />
          Origem do Tráfego
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="origin">
          <AccordionItem value="origin" className="border-none">
            <AccordionTrigger className="py-2">
              <span className="text-base font-semibold">Dados da Primeira Visita</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Primeira Visita</div>
                  <div className="font-medium mt-1">{formatDateTime(new Date(MOCK_ORIGIN.firstVisit))}</div>
                </div>
                
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help">
                          Campanha UTM <HelpCircle className="h-3 w-3" />
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p className="text-sm">
                          Parâmetro UTM usado para identificar campanhas específicas de marketing.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="font-medium mt-1">{MOCK_ORIGIN.utmCampaign}</div>
                </div>
                
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Fonte</div>
                  <div className="font-medium mt-1 flex items-center gap-1.5">
                    {getSourceIcon(MOCK_ORIGIN.utmSource)}
                    {MOCK_ORIGIN.utmSource} ({MOCK_ORIGIN.utmMedium})
                  </div>
                </div>
                
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Dispositivo</div>
                  <div className="font-medium mt-1 flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4" />
                    {MOCK_ORIGIN.device}
                  </div>
                </div>
                
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Localização</div>
                  <div className="font-medium mt-1 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {MOCK_ORIGIN.location}
                  </div>
                </div>
                
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Navegador</div>
                  <div className="font-medium mt-1 flex items-center gap-1.5">
                    <MousePointer className="h-4 w-4" />
                    {MOCK_ORIGIN.browser} / {MOCK_ORIGIN.os}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-md bg-muted/30 border">
                <p className="text-sm">
                  <strong>Nota:</strong> Estas informações são coletadas apenas quando o cliente
                  possui cookies habilitados e interage com links de campanha UTM.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LeadOriginInfo;
