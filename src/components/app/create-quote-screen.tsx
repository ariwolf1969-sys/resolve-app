'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Clock,
  Package,
  User,
  Send,
  MessageSquare,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

// ====== Constants ======
const VALIDITY_OPTIONS = [
  { value: '24', label: '24 horas' },
  { value: '48', label: '48 horas' },
  { value: '72', label: '72 horas' },
  { value: '168', label: '7 días' },
];

// ====== Main Component ======
export function CreateQuoteScreen() {
  const { goBack, setView, selectedUserProfile, currentUser } = useAppStore();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [includesMaterials, setIncludesMaterials] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState('');
  const [validity, setValidity] = useState('168');
  const [clientMessage, setClientMessage] = useState('');
  const [clientId, setClientId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidityDropdown, setShowValidityDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill professional info if coming from pro-profile
  const professionalName = selectedUserProfile?.name || '';
  const professionalId = selectedUserProfile?.id || '';

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (description.trim().length < 50) {
      newErrors.description = `Mínimo 50 caracteres (${description.trim().length}/50)`;
    }
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingresá un monto válido';
    }
    if (!estimatedHours || parseFloat(estimatedHours) <= 0) {
      newErrors.estimatedHours = 'Ingresá las horas estimadas';
    }
    if (!clientId.trim()) {
      newErrors.clientId = 'Ingresá el ID del cliente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Determine if this is a client request (from pro-profile) or professional quote
  const isClientRequest = !!professionalName && !currentUser?.profession;

  // Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setView('quotes');
  };

  const selectedValidity = VALIDITY_OPTIONS.find((o) => o.value === validity);

  const isValid =
    title.trim() &&
    description.trim().length >= 50 &&
    amount &&
    parseFloat(amount) > 0 &&
    estimatedHours &&
    parseFloat(estimatedHours) > 0 &&
    clientId.trim();

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {isClientRequest ? 'Solicitar Presupuesto' : 'Nuevo Presupuesto'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isClientRequest ? 'Contale al profesional lo que necesitás' : 'Completá los datos del servicio'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-5 pb-8">
        {/* Pre-filled professional info (for client requests) */}
        {professionalName && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{professionalName.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900">Solicitando presupuesto a</h3>
                <p className="text-base font-bold text-blue-700">{professionalName}</p>
                {selectedUserProfile?.profession && (
                  <p className="text-xs text-blue-600">{selectedUserProfile.profession}</p>
                )}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9 12l2 2 4-4" /><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              </svg>
            </div>
          </div>
        )}

        {/* Service Title */}
        <div>
          <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 text-foreground">
            <FileText className="h-4 w-4 text-blue-500" />
            Título del servicio <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Reparación de cañería en cocina"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            maxLength={100}
            className={`w-full p-3.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              errors.title ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.title && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
            {!errors.title && <span />}
            <p className="text-[10px] text-muted-foreground">{title.length}/100</p>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 text-foreground">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            Descripción detallada <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Describí en detalle el trabajo a realizar, materiales, condiciones, etc. (mínimo 50 caracteres)..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            maxLength={500}
            rows={4}
            className={`w-full p-3.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none ${
              errors.description ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
            {!errors.description && (
              <p className="text-[10px] text-muted-foreground">
                {description.trim().length < 50
                  ? `Faltan ${50 - description.trim().length} caracteres`
                  : 'Mínimo alcanzado ✓'}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground">{description.length}/500</p>
          </div>
          {/* Character progress bar */}
          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                description.trim().length >= 50
                  ? 'bg-emerald-500'
                  : description.trim().length >= 25
                  ? 'bg-amber-400'
                  : 'bg-gray-300'
              }`}
              style={{ width: `${Math.min(100, (description.trim().length / 50) * 100)}%` }}
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 text-foreground">
            <DollarSign className="h-4 w-4 text-blue-500" />
            Monto total <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              $
            </span>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              min="0"
              step="100"
              className={`w-full pl-8 pr-16 p-3.5 rounded-xl border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.amount ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium bg-gray-100 px-2 py-0.5 rounded">
              ARS
            </span>
          </div>
          {errors.amount && (
            <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              {errors.amount}
            </p>
          )}
          {amount && parseFloat(amount) > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Total: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(parseFloat(amount))}
            </p>
          )}
        </div>

        {/* Includes Materials */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">¿Incluye materiales?</p>
              <p className="text-xs text-muted-foreground">Indicá si el precio incluye insumos</p>
            </div>
          </div>
          <button
            onClick={() => setIncludesMaterials(!includesMaterials)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
              includesMaterials ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={includesMaterials}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                includesMaterials ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Estimated Hours */}
        <div>
          <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 text-foreground">
            <Clock className="h-4 w-4 text-blue-500" />
            Horas estimadas <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={estimatedHours}
              onChange={(e) => {
                setEstimatedHours(e.target.value);
                if (errors.estimatedHours) setErrors((prev) => ({ ...prev, estimatedHours: '' }));
              }}
              min="0.5"
              step="0.5"
              className={`w-full p-3.5 pr-16 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.estimatedHours ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium bg-gray-100 px-2 py-0.5 rounded">
              horas
            </span>
          </div>
          {errors.estimatedHours && (
            <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              {errors.estimatedHours}
            </p>
          )}
        </div>

        {/* Validity Period */}
        <div>
          <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 text-foreground">
            <Clock className="h-4 w-4 text-blue-500" />
            Validez del presupuesto
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowValidityDropdown(!showValidityDropdown)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <span className="text-foreground font-medium">{selectedValidity?.label}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  showValidityDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>
            {showValidityDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                {VALIDITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setValidity(option.value);
                      setShowValidityDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
                      validity === option.value
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Client Message / Additional notes */}
        <div>
          <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 text-foreground">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            {isClientRequest ? 'Describí tu problema o necesidad' : 'Mensaje para el cliente'}
          </label>
          <textarea
            placeholder={isClientRequest
              ? 'Contale al profesional qué necesitás, dónde estás, y cuándo te vendría bien...'
              : 'Dejale un mensaje personalizado al cliente sobre el presupuesto...'}
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full p-3.5 rounded-xl border border-gray-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
          <p className="text-[10px] text-muted-foreground mt-1">{clientMessage.length}/300</p>
        </div>

        {/* Client ID */}
        <div>
          <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 text-foreground">
            <User className="h-4 w-4 text-blue-500" />
            ID del cliente <span className="text-red-500">*</span>
            <span className="text-[10px] text-muted-foreground font-normal">(demo)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: cli-1"
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              if (errors.clientId) setErrors((prev) => ({ ...prev, clientId: '' }));
            }}
            className={`w-full p-3.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              errors.clientId ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
            }`}
          />
          {errors.clientId && (
            <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              {errors.clientId}
            </p>
          )}
        </div>

        {/* Summary Card */}
        {title && amount && parseFloat(amount) > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h4 className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wide">
              Resumen del presupuesto
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Servicio</span>
                <span className="font-medium text-foreground truncate ml-4 max-w-[200px]">{title}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monto</span>
                <span className="font-bold text-blue-600">
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(parseFloat(amount))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Materiales</span>
                <span className="font-medium text-foreground">{includesMaterials ? 'Incluidos' : 'No incluidos'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duración est.</span>
                <span className="font-medium text-foreground">
                  {estimatedHours ? `${estimatedHours}h` : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Validez</span>
                <span className="font-medium text-foreground">{selectedValidity?.label}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {isClientRequest ? 'Enviar solicitud' : 'Enviar presupuesto'}
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-muted-foreground">
          {isClientRequest
            ? 'Al enviar la solicitud, el profesional recibirá una notificación y podrá responder con un presupuesto detallado.'
            : 'Al enviar el presupuesto, el cliente recibirá una notificación y tendrá el plazo de validez para aceptarlo o rechazarlo.'}
        </p>
      </div>
    </div>
  );
}
