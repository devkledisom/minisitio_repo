import moment from 'moment';
import { masterPath, version } from '../../../../config/config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog.tsx";
import { Badge } from "../../../../components/ui/badge.tsx";
import { Separator } from "../../../../components/ui/separator.tsx";
import {
  Building2,
  User,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  Globe,
  Tag,
  FileText,
  Shield,
  MapPin,
  Hash,
} from "lucide-react";

// Helper to safely format dates (accepts ISO strings, timestamps, Date objects)
function safeFormat(date) {
  if (!date) return '-';
  const d = moment(date);
  return d && d.isValid() ? d.format('DD/MM/YYYY') : '-';
}

function getTipoAnuncio(tipo) {
  switch ((tipo || '').toString()) {
    case '1':
      return 'Básico';
    case '2':
      return 'Simples';
    case '3':
      return 'Completo';
    case '4':
      return 'Prefeitura';
    default:
      return 'Tipo desconhecido';
  }
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-all">{value ?? '-'}</p>
      </div>
    </div>
  );
}

export default function EspacoDetailModal({ espaco, open, onOpenChange }) {
  // Always render the Dialog to avoid inconsistent DOM when `open` toggles
  const pagamentos = Array.isArray(espaco?.pagamentos) ? espaco.pagamentos : [];
  const pagamento = pagamentos.length > 0 ? pagamentos[0] : null;

  const descAnuncio = espaco?.descAnuncio || espaco?.nome || espaco?.title || '-';
  const codAnuncio = espaco?.codAnuncio || espaco?.id || espaco?.codigo || '-';
  const descCPFCNPJ = espaco?.descCPFCNPJ || espaco?.cpfCnpj || '-';
  const codCaderno = espaco?.codCaderno || espaco?.nomeCaderno || espaco?.caderno || '-';
  const codUf = espaco?.codUf || espaco?.uf || '-';
  const codAtividade = espaco?.codAtividade || espaco?.atividade || '-';
  const criadoEm = espaco?.createdAt || espaco?.created_at || espaco?.dataCriacao || null;
  const validade = espaco?.dueDate || espaco?.validade || espaco?.expiration || null;
  const periodo = espaco?.periodo || espaco?.period || '-';
  const descPromocao = espaco?.descPromocao ?? 0;

  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">{descAnuncio}</DialogTitle>
              <p className="text-sm text-muted-foreground">Código: {codAnuncio}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Badge variant={espaco?.activate ? "default" : "destructive"} className={espaco?.activate ? "bg-success" : ""}>
              {espaco?.activate ? "Ativo" : "Inativo"}
            </Badge>
            <Badge>{getTipoAnuncio(espaco?.codTipoAnuncio)}</Badge>
            {espaco?.codDuplicado && <Badge variant="destructive">Duplicado</Badge>}
          </div>
        </DialogHeader>

        <Separator className="my-4 bg-slate-200" />

        {/* Informações Gerais */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Informações Gerais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow icon={Hash} label="Código de Origem" value={espaco?.codOrigem || espaco?.codOrigemBanco || '-'} />
            <InfoRow icon={FileText} label="CNPJ/CPF" value={descCPFCNPJ} />
            <InfoRow icon={Tag} label="Caderno" value={codCaderno} />
            <InfoRow icon={MapPin} label="UF" value={codUf} />
            <InfoRow icon={Shield} label="Atividade Principal" value={codAtividade} />
            <InfoRow icon={Calendar} label="Cadastrado em" value={safeFormat(criadoEm)} />
            <InfoRow icon={Calendar} label="Validade" value={safeFormat(validade)} />
            <InfoRow icon={Tag} label="Período" value={periodo} />
          </div>
        </div>

        <Separator className="my-4 bg-slate-200" />

        {/* Pagamento */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Pagamento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow
              icon={CreditCard}
              label="Status"
              value={
                pagamento ? (
                  <Badge variant={pagamento.status === "Pago" || pagamento.status === "Aprovado" ? "default" : "secondary"} className={pagamento.status === "Pago" || pagamento.status === "Aprovado" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                    {pagamento.status}
                  </Badge>
                ) : (

                  <Badge variant="success" className={pagamentos.status === "Aprovado" ? "border-success text-success" : "border-info text-info"}>
                    Isento
                  </Badge>
                )
              }
            />
            <InfoRow icon={CreditCard} label="Valor" value={pagamento ? `R$ ${pagamento.valor ?? pagamento.amount ?? '0'}` : 'Isento'} />
            <InfoRow icon={Calendar} label="Data do Pagamento" value={pagamento ? safeFormat(pagamento.data || pagamento.date || pagamento.paidAt) : 'Isento'} />
            <InfoRow icon={Tag} label="Desconto" value={`R$ ${descPromocao}`} />
            {espaco?.codDesconto && <InfoRow icon={Hash} label="ID Desconto" value={espaco?.codDesconto} />}
          </div>
        </div>

        <Separator className="my-4 bg-slate-200" />

        {/* Usuário / Acesso */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Usuário / Acesso</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow icon={User} label="Usuário/Decisor" value={espaco?.codUsuario || espaco?.usuario || '-'} />
            <InfoRow icon={User} label="Login" value={espaco?.loginUser || espaco?.login || '-'} />
            <InfoRow icon={Mail} label="Email" value={espaco?.loginEmail || espaco?.email || '-'} />
            <InfoRow icon={Phone} label="Contato" value={espaco?.loginContato || espaco?.contato || '-'} />
            <InfoRow
              icon={Globe}
              label="Link do Perfil"
              value={
                <a href={`/perfil/${codAnuncio}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {masterPath.domain}/perfil/${codAnuncio}
                </a>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
