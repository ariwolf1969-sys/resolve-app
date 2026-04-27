'use client';

import { useAppStore, type Quote } from '@/store/app-store';
import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  FileText,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Camera,
  Star,
  Shield,
  ChevronRight,
  Send,
  Package,
  User,
  Calendar,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// ====== Helpers ======
const CURRENT_USER_ID = 'cli-1'; // Demo: current user is María García

function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ====== Status Config ======
function getStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return { label: 'Pendiente', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', ring: 'ring-amber-500/20' };
    case 'accepted':
      return { label: 'Aceptado', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', ring: 'ring-emerald-500/20' };
    case 'rejected':
      return { label: 'Rechazado', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', ring: 'ring-red-500/20' };
    case 'completed':
      return { label: 'Completado', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', ring: 'ring-blue-500/20' };
    case 'cancelled':
      return { label: 'Cancelado', bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400', ring: 'ring-gray-400/20' };
    default:
      return { label: status, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400', ring: 'ring-gray-400/20' };
  }
}

// ====== Demo Quote Data ======
const DEMO_QUOTE: Quote = {
  id: 'q-001',
  title: 'Reparación de cañería en cocina',
  description:
    'Fuga de agua en la cañería principal de la cocina. Se necesita reemplazar un tramo de tubería de PVC de aproximadamente 2 metros y verificar todas las uniones para asegurar que no haya más filtraciones. Se trabajará con herramientas profesionales y se dejará el área completamente limpia al finalizar.',
  amount: 45000,
  currency: 'ARS',
  status: 'accepted',
  needId: 'need-1',
  providerId: 'pro-1',
  clientId: 'cli-1',
  validityHours: 48,
  includesMaterials: true,
  estimatedHours: 3,
  providerMessage: 'Hola María, puedo ir mañana temprano (entre 9-10hs). El precio incluye todos los materiales necesarios: tubería PVC, pegamento, cintas y sellos. Tengo experiencia con este tipo de reparaciones.',
  clientMessage: 'Perfecto Carlos, mañana me quedaré en casa. La fuga está en la cocina, al lado del lavaplatos.',
  acceptedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  provider: {
    id: 'pro-1',
    name: 'Carlos Méndez',
    profession: 'Plomero matriculado',
    ratingAvg: 4.8,
    ratingCount: 42,
    dniVerified: true,
  },
  client: {
    id: 'cli-1',
    name: 'María García',
    ratingAvg: 4.5,
    ratingCount: 8,
  },
  transactions: [
    {
      id: 'tx-001',
      quoteId: 'q-001',
      amount: 45000,
      currency: 'ARS',
      platformFee: 4500,
      status: 'held',
      paymentMethod: 'MercadoPago',
      paymentRef: 'MP-REF-123456',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  checkIns: [
    {
      id: 'ci-001',
      quoteId: 'q-001',
      userId: 'pro-1',
      type: 'arrival',
      lat: -34.6037,
      lng: -58.3816,
      address: 'Av. Corrientes 4521, CABA',
      photoUrl: '/checkin-arrival.jpg',
      notes: 'Llegué al domicilio, verificando la fuga.',
      verified: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: { id: 'pro-1', name: 'Carlos Méndez' },
    },
    {
      id: 'ci-002',
      quoteId: 'q-001',
      userId: 'pro-1',
      type: 'start',
      lat: -34.6037,
      lng: -58.3816,
      address: 'Av. Corrientes 4521, CABA',
      photoUrl: '/checkin-start.jpg',
      notes: 'Comencé con la reparación. La fuga es en la unión del tubo principal.',
      verified: true,
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      user: { id: 'pro-1', name: 'Carlos Méndez' },
    },
    {
      id: 'ci-003',
      quoteId: 'q-001',
      userId: 'pro-1',
      type: 'progress',
      lat: -34.6037,
      lng: -58.3816,
      address: 'Av. Corrientes 4521, CABA',
      photoUrl: '/checkin-progress.jpg',
      notes: 'Avance 50%. Reemplacé el tramo dañado. Ahora voy a verificar las uniones.',
      verified: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      user: { id: 'pro-1', name: 'Carlos Méndez' },
    },
  ],
  disputes: [],
};

// ====== Workflow Timeline ======
type TimelineStep = {
  label: string;
  completed: boolean;
  current: boolean;
  time?: string;
};

function getTimelineSteps(quote: Quote, isProvider: boolean): TimelineStep[] {
  const hasAccepted = !!quote.acceptedAt;
  const hasCompleted = !!quote.completedAt;
  const hasCheckIns = (quote.checkIns || []).length > 0;
  const hasArrival = (quote.checkIns || []).some((c) => c.type === 'arrival');
  const hasTransaction = (quote.transactions || []).some((t) => t.status === 'released');

  return [
    {
      label: 'Presupuesto enviado',
      completed: true,
      current: quote.status === 'pending',
      time: formatTime(quote.createdAt),
    },
    {
      label: 'Presupuesto aceptado',
      completed: hasAccepted,
      current: hasAccepted && !hasArrival,
      time: quote.acceptedAt ? formatTime(quote.acceptedAt) : undefined,
    },
    {
      label: 'Profesional llegó',
      completed: hasArrival,
      current: hasArrival && !hasCompleted,
      time: hasArrival
        ? formatTime(
            (quote.checkIns || []).find((c) => c.type === 'arrival')!.createdAt
          )
        : undefined,
    },
    {
      label: 'Trabajo completado',
      completed: hasCompleted,
      current: hasCompleted && !hasTransaction,
      time: quote.completedAt ? formatTime(quote.completedAt) : undefined,
    },
    {
      label: 'Pago liberado',
      completed: hasTransaction,
      current: false,
      time: hasTransaction
        ? formatTime(
            (quote.transactions || []).find((t) => t.status === 'released')!
              .createdAt
          )
        : undefined,
    },
  ];
}

function TimelineSection({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-blue-500" />
        Estado del trabajo
      </h3>
      <div className="space-y-0">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  step.completed
                    ? 'bg-emerald-500 border-emerald-500'
                    : step.current
                    ? 'bg-blue-500 border-blue-500 ring-4 ring-blue-500/20'
                    : 'bg-white border-gray-300'
                }`}
              >
                {step.completed ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.current ? (
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 h-8 ${
                    step.completed ? 'bg-emerald-300' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            {/* Content */}
            <div className="pb-6 flex-1">
              <p
                className={`text-sm font-medium ${
                  step.completed
                    ? 'text-foreground'
                    : step.current
                    ? 'text-blue-600'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </p>
              {step.time && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{step.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ====== Transaction Section ======
function TransactionSection({ quote }: { quote: Quote }) {
  const tx = quote.transactions?.[0];
  if (!tx) return null;

  const isHeld = tx.status === 'held';
  const isReleased = tx.status === 'released';
  const isRefunded = tx.status === 'refunded';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Lock className="h-4 w-4 text-blue-500" />
        Transacción & Pago
      </h3>

      <div className="space-y-3">
        {/* Escrow status */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
          <div className="flex items-center gap-2">
            <Shield
              className={`h-5 w-5 ${
                isHeld
                  ? 'text-amber-500'
                  : isReleased
                  ? 'text-emerald-500'
                  : 'text-red-500'
              }`}
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                {isHeld
                  ? 'Pago retenido (Escrow)'
                  : isReleased
                  ? 'Pago liberado'
                  : 'Pago devuelto'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {isHeld
                  ? 'El dinero está seguro hasta que confirmes'
                  : isReleased
                  ? 'Transferido al profesional'
                  : 'El dinero fue devuelto al cliente'}
              </p>
            </div>
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isHeld
                ? 'bg-amber-500'
                : isReleased
                ? 'bg-emerald-500'
                : 'bg-red-500'
            }`}
          />
        </div>

        {/* Amount details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monto total</span>
            <span className="font-semibold text-foreground">{formatARS(tx.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Comisión plataforma (10%)</span>
            <span className="font-medium text-red-500">-{formatARS(tx.platformFee)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Neto profesional</span>
            <span className="font-bold text-emerald-600">
              {formatARS(tx.amount - tx.platformFee)}
            </span>
          </div>
        </div>

        {/* Payment method */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">MP</span>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">{tx.paymentMethod}</p>
            <p className="text-[10px] text-muted-foreground">Ref: {tx.paymentRef}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====== Check-in Section ======
function CheckInSection({ quote }: { quote: Quote }) {
  const checkIns = quote.checkIns || [];
  if (checkIns.length === 0) return null;

  function getCheckInTypeLabel(type: string) {
    switch (type) {
      case 'arrival':
        return { label: 'Llegada al domicilio', color: 'bg-blue-500' };
      case 'start':
        return { label: 'Inicio del trabajo', color: 'bg-blue-500' };
      case 'progress':
        return { label: 'Progreso', color: 'bg-purple-500' };
      case 'completion':
        return { label: 'Trabajo finalizado', color: 'bg-emerald-500' };
      default:
        return { label: type, color: 'bg-gray-500' };
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-blue-500" />
        Registro de actividad
      </h3>

      <div className="space-y-3">
        {checkIns.map((checkIn) => {
          const typeConfig = getCheckInTypeLabel(checkIn.type);
          return (
            <div
              key={checkIn.id}
              className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              {/* Photo placeholder */}
              <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                <Camera className="h-5 w-5 text-gray-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${typeConfig.color}`}
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {typeConfig.label}
                  </span>
                  {checkIn.verified && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                      Verificado
                    </span>
                  )}
                </div>
                {checkIn.notes && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-1">
                    {checkIn.notes}
                  </p>
                )}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(checkIn.createdAt)}
                  </span>
                  {checkIn.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {checkIn.address}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ====== Dispute Section ======
function DisputeSection({ quote }: { quote: Quote }) {
  const disputes = quote.disputes || [];
  if (disputes.length === 0) return null;

  const dispute = disputes[0];

  function getDisputeStatusConfig(status: string) {
    switch (status) {
      case 'open':
        return { label: 'Abierto', color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'under_review':
        return { label: 'En revisión', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'resolved':
        return { label: 'Resuelto', color: 'text-emerald-600', bg: 'bg-emerald-50' };
      default:
        return { label: status, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  }

  const statusConfig = getDisputeStatusConfig(dispute.status);

  return (
    <div className="bg-white rounded-2xl border border-red-100 p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        Disputa
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
          <span className="text-[11px] text-muted-foreground">{formatDate(dispute.createdAt)}</span>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-1">Motivo</p>
          <p className="text-sm text-muted-foreground">{dispute.reason}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-1">Descripción</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{dispute.description}</p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <User className="h-3 w-3" />
          <span>Reportado por {dispute.filedBy.name}</span>
        </div>

        {dispute.resolution && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-700 mb-1">Resolución</p>
            <p className="text-sm text-emerald-600">{dispute.resolution}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ====== Countdown Timer ======
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return 'Vencido';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const isExpired = timeLeft === 'Vencido';
  const isUrgent = !isExpired && new Date(targetDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
      isExpired ? 'bg-red-50 border border-red-200' : isUrgent ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'
    }`}>
      <Clock className={`h-4 w-4 ${isExpired ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-gray-500'}`} />
      <div>
        <p className={`text-xs font-semibold ${isExpired ? 'text-red-700' : isUrgent ? 'text-amber-700' : 'text-foreground'}`}>
          {isExpired ? '¡Presupuesto vencido!' : `Vence en: ${timeLeft}`}
        </p>
        {!isExpired && isUrgent && (
          <p className="text-[10px] text-amber-600">Quedan menos de 24 horas</p>
        )}
      </div>
    </div>
  );
}

// ====== Deposit Section ======
function DepositSection({ quote }: { quote: Quote }) {
  const [depositPaid, setDepositPaid] = useState(!!(quote as any).depositPaid);
  const depositAmount = (quote as any).depositAmount || quote.amount * 0.2;
  const validUntil = (quote as any).validUntil || quote.expiresAt;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-emerald-500" />
        Seña y Reserva
      </h3>

      {!depositPaid ? (
        <>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Seña del 20%</p>
              <span className="text-lg font-bold text-emerald-700">{formatARS(depositAmount)}</span>
            </div>
            <p className="text-xs text-emerald-600/70">
              Reservá tu presupuesto pagando el 20% como seña. El monto se descuenta del total.
            </p>
          </div>

          {validUntil && <CountdownTimer targetDate={validUntil} />}

          <button
            onClick={() => setDepositPaid(true)}
            className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" x2="23" y1="10" y2="10" />
            </svg>
            Pagar seña del 20% ({formatARS(depositAmount)})
          </button>
        </>
      ) : (
        <>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700">Seña pagada</p>
                <p className="text-xs text-emerald-600">{formatARS(depositAmount)} reservados · Se descuentan del total</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm bg-gray-50 rounded-xl p-3">
            <span className="text-muted-foreground">Saldo pendiente</span>
            <span className="font-bold text-foreground">{formatARS(quote.amount - depositAmount)}</span>
          </div>
          {validUntil && <CountdownTimer targetDate={validUntil} />}
        </>
      )}
    </div>
  );
}

// ====== Main Component ======
export function QuoteDetailScreen() {
  const { goBack, setView, selectedQuote } = useAppStore();

  // Use selected quote or fall back to demo data
  const quote: Quote = selectedQuote || DEMO_QUOTE;
  const isClient = quote.clientId === CURRENT_USER_ID;
  const isProvider = quote.providerId === CURRENT_USER_ID;
  const statusConfig = getStatusConfig(quote.status);
  const timelineSteps = getTimelineSteps(quote, isProvider);

  // Determine which actions to show
  const showAcceptReject = quote.status === 'pending' && isClient;
  const showProviderCheckIn = quote.status === 'accepted' && isProvider;
  const showClientConfirmArrival = quote.status === 'accepted' && isClient;
  const showReleasePayment = isClient && (quote.checkIns || []).some((c) => c.type === 'arrival') && quote.status === 'accepted';
  const showRate = quote.status === 'completed';
  const providerArrived = (quote.checkIns || []).some((c) => c.type === 'arrival');

  return (
    <div className="min-h-full bg-gray-50/50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Detalle del Presupuesto</h1>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {/* ====== Quote Info Card ====== */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
          {/* Title */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-snug">{quote.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(quote.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-1">Monto total</p>
            <p className="text-2xl font-bold text-blue-600">{formatARS(quote.amount)}</p>
            <div className="flex items-center gap-3 mt-2">
              {quote.includesMaterials && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-white/80 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  <Package className="h-3 w-3" />
                  Materiales incluidos
                </span>
              )}
              {quote.estimatedHours && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-white/80 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  <Clock className="h-3 w-3" />
                  {quote.estimatedHours}h estimadas
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Descripción
            </h3>
            <p className="text-sm text-foreground leading-relaxed">{quote.description}</p>
          </div>

          {/* Provider info */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
              Profesional
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="text-sm font-bold text-white bg-blue-500">
                  {getInitials(quote.provider.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{quote.provider.name}</p>
                  {quote.provider.dniVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                      <Shield className="h-2.5 w-2.5" />
                      DNI Verificado
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{quote.provider.profession}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-foreground">{quote.provider.ratingAvg}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">({quote.provider.ratingCount} trabajos)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client info */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
              Cliente
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="text-sm font-bold text-white bg-emerald-500">
                  {getInitials(quote.client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{quote.client.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-foreground">{quote.client.ratingAvg}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">({quote.client.ratingCount} valoraciones)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Provider message */}
          {quote.providerMessage && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Mensaje del profesional
              </h3>
              <div className="bg-gray-50 rounded-xl p-3 text-sm text-foreground leading-relaxed">
                {quote.providerMessage}
              </div>
            </div>
          )}

          {/* Client message */}
          {quote.clientMessage && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Mensaje del cliente
              </h3>
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-foreground leading-relaxed">
                {quote.clientMessage}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
              Fechas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Creado</p>
                <p className="text-xs font-medium text-foreground">{formatDate(quote.createdAt)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Validez</p>
                <p className="text-xs font-medium text-foreground">{quote.validityHours}h</p>
              </div>
              {quote.acceptedAt && (
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-[10px] text-emerald-600 mb-0.5">Aceptado</p>
                  <p className="text-xs font-medium text-emerald-700">{formatDate(quote.acceptedAt)}</p>
                </div>
              )}
              {quote.completedAt && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-[10px] text-blue-600 mb-0.5">Completado</p>
                  <p className="text-xs font-medium text-blue-700">{formatDate(quote.completedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====== Workflow Timeline ====== */}
        <TimelineSection steps={timelineSteps} />

        {/* ====== Transaction Section ====== */}
        {quote.transactions && quote.transactions.length > 0 && (
          <TransactionSection quote={quote} />
        )}

        {/* ====== Deposit Section (for accepted quotes) ====== */}
        {quote.status === 'accepted' && isClient && (
          <DepositSection quote={quote} />
        )}

        {/* ====== Check-in Section ====== */}
        {(quote.checkIns || []).length > 0 && <CheckInSection quote={quote} />}

        {/* ====== Dispute Section ====== */}
        {(quote.disputes || []).length > 0 && <DisputeSection quote={quote} />}
      </div>

      {/* ====== Bottom Action Bar ====== */}
      {(showAcceptReject || showProviderCheckIn || showClientConfirmArrival || showReleasePayment || showRate) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-20">
          <div className="max-w-lg mx-auto">
            {/* Accept / Reject */}
            {showAcceptReject && (
              <div className="flex gap-3">
                <button
                  onClick={() => setView('dispute')}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all active:scale-[0.98]"
                >
                  <XCircle className="h-4 w-4" />
                  Rechazar
                </button>
                <button
                  onClick={() => setView('quotes')}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle className="h-4 w-4" />
                  Aceptar
                </button>
              </div>
            )}

            {/* Client: Professional arrived */}
            {showClientConfirmArrival && !showReleasePayment && (
              <button
                onClick={() => setView('check-in')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
              >
                <MapPin className="h-4 w-4" />
                El profesional llegó a mi domicilio
              </button>
            )}

            {/* Provider: Register arrival */}
            {showProviderCheckIn && (
              <button
                onClick={() => setView('check-in')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
              >
                <MapPin className="h-4 w-4" />
                Registrar llegada
              </button>
            )}

            {/* Client: Release payment / Report problem */}
            {showReleasePayment && (
              <div className="flex gap-3">
                <button
                  onClick={() => setView('dispute')}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all active:scale-[0.98]"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Reportar problema
                </button>
                <button
                  onClick={() => setView('quotes')}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                >
                  <DollarSign className="h-4 w-4" />
                  Liberar pago
                </button>
              </div>
            )}

            {/* Rate completed */}
            {showRate && (
              <button
                onClick={() => setView('quotes')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
              >
                <Star className="h-4 w-4" />
                Calificar servicio
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
