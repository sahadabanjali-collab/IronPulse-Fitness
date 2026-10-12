import { X, Phone, Mail, MessageSquare, Clock, User, Trash2 } from "lucide-react";
import { Inquiry } from "../../types/inquiry";

interface InquiryDetailModalProps {
  inquiry: Inquiry;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export default function InquiryDetailModal({
  inquiry,
  onClose,
  onDelete,
}: InquiryDetailModalProps) {
  const getCleanPhone = (phoneStr: string) => {
    return phoneStr.replace(/\D/g, "");
  };

  const cleanPhone = getCleanPhone(inquiry.phone);
  const whatsappUrl = `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
    `Hello ${inquiry.name}, thank you for reaching out to IronPulse Fitness regarding "${inquiry.subject}". How can we help you today?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">{inquiry.name}</h2>
              <p className="text-xs text-zinc-400">Received via {inquiry.source}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {/* Quick Outreach Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs py-2.5 px-3 rounded-xl transition-all"
            >
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${inquiry.phone}`}
              className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold text-xs py-2.5 px-3 rounded-xl transition-all"
            >
              <Phone className="h-4 w-4 text-blue-400" />
              <span>Call Phone</span>
            </a>

            <a
              href={`mailto:${inquiry.email}?subject=IronPulse Fitness - Your Inquiry regarding ${inquiry.subject}`}
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold text-xs py-2.5 px-3 rounded-xl transition-all"
            >
              <Mail className="h-4 w-4 text-zinc-400" />
              <span>Send Email</span>
            </a>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80">
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Email</span>
              <p className="text-sm font-medium text-zinc-200 break-all">{inquiry.email}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Phone Number</span>
              <p className="text-sm font-medium text-zinc-200 font-mono">{inquiry.phone}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Subject / Goal</span>
              <p className="text-sm font-bold text-red-400">{inquiry.subject}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Date & Time</span>
              <p className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                <span>{inquiry.submittedAt}</span>
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              User Message
            </span>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap">
              {inquiry.message || "No message content."}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 flex justify-between items-center">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete the submission from "${inquiry.name}"?`)) {
                    onDelete(inquiry.id);
                  }
                }}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Submission</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
