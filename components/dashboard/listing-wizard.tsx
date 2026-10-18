"use client"

import { Check, ChevronLeft, ChevronRight, Loader2, Lightbulb } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface WizardStep {
  id: number
  name: string
  description: string
  icon: LucideIcon
}

// Shared form styles for the listing wizard
export const fieldLabel = "text-xs font-semibold text-slate-600 dark:text-slate-300"
export const inputClass =
  "h-11 rounded-xl border-slate-200 bg-white text-sm shadow-none transition-colors placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 dark:border-slate-700 dark:bg-slate-800/40"
export const selectTriggerClass =
  "h-11 data-[size=default]:h-11 w-full rounded-xl border-slate-200 bg-white text-sm shadow-none hover:border-slate-300 focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800/40"
export const textareaClass =
  "min-h-32 rounded-xl border-slate-200 bg-white text-sm leading-relaxed shadow-none resize-none placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 dark:border-slate-700 dark:bg-slate-800/40"
export const groupHeading = "text-xs font-semibold uppercase tracking-wider text-slate-500"

export function WizardHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-[#b83d0d] text-white shadow-lg shadow-primary/25">
        <Icon className="size-5" />
      </div>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  )
}

export function WizardStepper({
  steps,
  current,
  onStepClick,
}: {
  steps: WizardStep[]
  current: number
  onStepClick: (id: number) => void
}) {
  return (
    <ol className="flex items-start border-b border-slate-100 px-6 py-6 sm:px-10 dark:border-slate-800">
      {steps.map((step, i) => {
        const done = step.id < current
        const active = step.id === current
        const Icon = step.icon
        return (
          <li key={step.id} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && (
              <div className="absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2 bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: step.id <= current ? "100%" : "0%" }}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => done && onStepClick(step.id)}
              disabled={!done}
              aria-current={active ? "step" : undefined}
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                done && "cursor-pointer border-primary bg-primary text-white hover:scale-105",
                active && "border-primary bg-white text-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10 dark:bg-slate-900",
                !done && !active && "border-slate-200 bg-white text-slate-300 dark:border-slate-700 dark:bg-slate-900",
              )}
            >
              {done ? <Check className="size-4" strokeWidth={3} /> : <Icon className="size-4" />}
            </button>
            <span
              className={cn(
                "mt-2.5 hidden text-xs font-semibold sm:block",
                active ? "text-slate-800 dark:text-white" : done ? "text-slate-600 dark:text-slate-300" : "text-slate-400",
              )}
            >
              {step.name}
            </span>
            <span className="hidden text-[11px] text-slate-400 lg:block">{step.description}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function WizardFooter({
  current,
  total,
  onBack,
  onNext,
  submitting,
  firstLabel = "Cancel",
  nextLabel,
  finalLabel,
  submittingLabel,
}: {
  current: number
  total: number
  onBack: () => void
  onNext: () => void
  submitting: boolean
  firstLabel?: string
  nextLabel: string
  finalLabel: string
  submittingLabel: string
}) {
  const isLast = current === total
  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:px-10 dark:border-slate-800 dark:bg-slate-800/20">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        {current > 1 && <ChevronLeft className="size-4" />}
        {current === 1 ? firstLabel : "Back"}
      </button>
      <span className="hidden text-xs font-medium text-slate-400 sm:block">
        Step {current} of {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={submitting}
        className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {submittingLabel}
          </>
        ) : isLast ? (
          <>
            <Check className="size-4" />
            {finalLabel}
          </>
        ) : (
          <>
            {nextLabel}
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </div>
  )
}

export function StepHeading({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-white">{title}</h3>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

export function SideTip({ title, text, icon: Icon = Lightbulb }: { title: string; text: string; icon?: LucideIcon }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-500/10">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{text}</p>
      </div>
    </div>
  )
}

export function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 p-5 dark:border-slate-800">
      <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white">{title}</h4>
      {children}
    </div>
  )
}

export function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-dashed border-slate-100 py-2 last:border-0 dark:border-slate-800">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium first-letter:uppercase text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  )
}

export function ReviewTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      <Check className="size-3" />
      {children}
    </span>
  )
}
