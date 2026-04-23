import React from 'react';
import { useNavigate } from 'react-router';
import type { Service } from '../types';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Coins,
  Building2,
  BadgeCheck 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();

  const getDaysAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    return `${days} dias atrás`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
        {/* Badges de Status */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {service.urgent && (
            <Badge variant="destructive" className="text-xs">
              Urgente
            </Badge>
          )}
          {service.featured && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-xs">
              Destaque
            </Badge>
          )}
          {service.applied && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Candidatura enviada
            </Badge>
          )}
        </div>

        <CardContent className="pt-6">
          {/* Empresa */}
          <div className="flex items-center gap-2 mb-4">
            {service.company.logo ? (
              <img 
                src={service.company.logo} 
                alt={service.company.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {service.company.name}
                </p>
                {service.company.verified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500">{getDaysAgo(service.createdAt)}</p>
            </div>
          </div>

          {/* Título e Descrição */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {service.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {service.shortDescription}
          </p>

          {/* Categoria */}
          <Badge variant="outline" className="mb-4">
            {service.category}
          </Badge>

          {/* Informações */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="font-semibold text-green-700">
                R$ {service.price.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{service.deadline} dias</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{service.city} - {service.state}</span>
            </div>
          </div>

          {/* Custo em Moedas */}
          {service.coinCost && (
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200 mb-4">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-900">
                Custa <strong>{service.coinCost} moedas</strong> para candidatar
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0" >
          <Button 
            className="w-full bg-[#006D5B] hover:bg-[#006D5B]/90 text-white"
            onClick={() => navigate(`/service/${service.id}`)}
            variant={service.applied ? "secondary" : "default"}
          >
            Ver detalhes
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
