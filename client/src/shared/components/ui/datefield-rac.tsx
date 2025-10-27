import React from "react"
import {
  composeRenderProps,
  DateField as DateFieldRac,
  DateInput as DateInputRac,
  DateSegment as DateSegmentRac,
  TimeField as TimeFieldRac,
} from "react-aria-components"
import type { DateValue as DateValueRac } from "react-aria-components"
import type { TimeValue as TimeValueRac } from "react-aria"

import { cn } from "@/shared/components/lib/utils"
import { dateInputStyle } from "./datefield-rac.constants"

type DateFieldProps<T extends DateValueRac> = React.ComponentProps<typeof DateFieldRac<T>>
type TimeFieldProps<T extends TimeValueRac> = React.ComponentProps<typeof TimeFieldRac<T>>
type DateInputPropsRac = React.ComponentProps<typeof DateInputRac>
type DateSegmentProps = React.ComponentProps<typeof DateSegmentRac>

function DateField<T extends DateValueRac>({
  className,
  children,
  ...props
}: DateFieldProps<T>) {
  return (
    <DateFieldRac
      className={composeRenderProps(className, (className) => cn(className))}
      {...props}
    >
      {children}
    </DateFieldRac>
  )
}

function TimeField<T extends TimeValueRac>({
  className,
  children,
  ...props
}: TimeFieldProps<T>) {
  return (
    <TimeFieldRac
      className={composeRenderProps(className, (className) => cn(className))}
      {...props}
    >
      {children}
    </TimeFieldRac>
  )
}

function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <DateSegmentRac
      className={composeRenderProps(className, (className) =>
        cn(
          "inline rounded p-0.5 text-foreground caret-transparent outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focused:bg-accent data-focused:text-foreground data-invalid:text-destructive data-invalid:data-focused:bg-destructive data-invalid:data-focused:text-white data-placeholder:text-muted-foreground/70 data-focused:data-placeholder:text-foreground data-invalid:data-placeholder:text-destructive data-invalid:data-focused:data-placeholder:text-white data-[type=literal]:px-0 data-[type=literal]:text-muted-foreground/70",
          className
        )
      )}
      {...props}
      data-invalid
    />
  )
}

interface DateInputProps extends DateInputPropsRac {
  className?: string
  unstyled?: boolean
}

function DateInput({
  className,
  unstyled = false,
  ...props
}: Omit<DateInputProps, "children">) {
  return (
    <DateInputRac
      className={composeRenderProps(className, (className) =>
        cn(!unstyled && dateInputStyle, className)
      )}
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </DateInputRac>
  )
}

export { DateField, DateInput, DateSegment, TimeField }
export type { DateInputProps }
