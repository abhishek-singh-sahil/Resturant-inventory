import React from 'react'
import {
  RefreshCw,
  History,
  ArrowRight,
  Sparkles,
  Info,
  AlertTriangle
} from 'lucide-react'

const PremiumBusinessDayCard = ({
  businessDate,
  previousBusinessDate,
  loading = false,
  rolling = false,
  onNextDay
}) => {
  // Formats the main business date
  const formatDate = date => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDay = date => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long'
    })
  }

  // Formats as a date instead of time
  const formatPreviousDate = date => {
    if (!date) return '--'
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className='group relative w-full max-w-4xl rounded-[2.5rem] bg-[#050505] p-2 shadow-[0_0_40px_-15px_rgba(255,255,255,0.1)] transition-all hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.15)]'>
      {/* Animated Gradient Border Effect */}
      <div className='absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-zinc-500/30 via-zinc-500/5 to-zinc-500/30 opacity-50 transition-opacity duration-500 group-hover:opacity-100' />

      {/* Inner Card Container */}
      <div className='relative flex flex-col overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#0A0A0A] md:flex-row'>
        {/* Left Section: Main Current Date */}
        <div className='relative flex min-h-[300px] flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-900 to-[#0A0A0A] p-8 md:p-12'>
          {/* Subtle background texture/glow */}
          <div className='absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl' />

          <div>
            <div className='mb-6 flex items-center gap-2'>
              <span className='text-bold font-semibold uppercase tracking-widest text-zinc-400'>
                Business Day
              </span>
            </div>

            {loading ? (
              <div className='space-y-4 pt-2'>
                <div className='h-14 w-3/4 animate-pulse rounded-xl bg-white/10' />
                <div className='h-6 w-1/3 animate-pulse rounded-lg bg-white/5' />
              </div>
            ) : (
              <div className='space-y-2'>
                <h2 className='bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-6xl'>
                  {formatDate(businessDate) || 'No Date'}
                </h2>
                <p className='text-xl font-medium text-zinc-500'>
                  {formatDay(businessDate)}
                </p>
              </div>
            )}
          </div>

          <div className='mt-12 flex items-start gap-3 rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/5 backdrop-blur-md'>
            <Info size={20} className='shrink-0 text-zinc-400' />
            <p className='text-sm leading-relaxed text-zinc-400'>
              Closing stock from today will automatically be forwarded as
              tomorrow's opening stock for both the Store and Kitchen.
            </p>
          </div>
        </div>

        {/* Right Section: Previous Date & Action */}
        <div className='flex w-full flex-col justify-between border-t border-white/10 bg-[#0F0F11] p-8 md:w-[380px] md:border-l md:border-t-0 md:p-12'>
          {/* Previous Rollover Date Module */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10'>
                <History size={18} className='text-zinc-300' />
              </div>
              <span className='text-xs font-semibold uppercase tracking-wider text-zinc-500'>
                Previous Rollover Date
              </span>
            </div>

            {loading ? (
              <div className='h-8 w-32 animate-pulse rounded-lg bg-white/10' />
            ) : (
              <p className='text-2xl font-semibold text-zinc-200'>
                {formatPreviousDate(previousBusinessDate)}
              </p>
            )}
          </div>

          {/* Action Area */}
          <div className='mt-12 pt-8'>
            {/* Warning Message */}
            <div className='mb-3 flex items-center gap-2 px-1 text-amber-500/80'>
              <AlertTriangle size={14} />
              <span className='text-[10px] font-bold uppercase tracking-widest'>
                Do only once per day
              </span>
            </div>
            <br></br>
            {/* Action Button */}
            <button
              disabled={rolling || loading}
              onClick={onNextDay}
              className='group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-zinc-100 px-6 py-5 text-sm font-bold text-zinc-900 transition-all duration-300 hover:bg-white active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'
            >
              <span className='relative z-10'>
                {rolling
                  ? 'Initializing Next Day...'
                  : 'Start Next Business Day'}
              </span>

              <div className='relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-300/50 transition-transform duration-300 group-hover:bg-zinc-300'>
                {rolling ? (
                  <RefreshCw size={16} className='animate-spin text-zinc-900' />
                ) : (
                  <ArrowRight
                    size={16}
                    className='text-zinc-900 transition-transform duration-300 group-hover:translate-x-0.5'
                  />
                )}
              </div>

              {/* Hover shimmer effect inside button */}
              <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumBusinessDayCard
