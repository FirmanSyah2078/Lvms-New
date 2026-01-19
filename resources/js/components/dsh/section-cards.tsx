import { IconUsers, IconProgressCheck, IconUserOff, IconPercentage } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Stats {
    totalDpt: number;
    totalBallotsCast: number;
    remainingVoters: number;
    participationRate: number;
}

export function SectionCards({ stats }: { stats: Stats }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">

      {/* Card 1: Total Hak Pilih */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Dpt letters</CardDescription>
          <CardTitle className="min-w-0 font-semibold tabular-nums text-[clamp(1rem,8cqw,1.25rem)]">
            {stats.totalDpt.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="p-1.5">
              <IconUsers className="size-5" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm">
          <div className="text-muted-foreground">
           Permanent voter list
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Suara Masuk */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Ballots Cast</CardDescription>
          <CardTitle className="min-w-0 font-semibold tabular-nums text-[clamp(1rem,8cqw,1.25rem)]">
            {stats.totalBallotsCast.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="p-1.5 text-green-500 border-green-500/50">
              <IconProgressCheck className="size-5 animate-pulse" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm">
          <div className="text-muted-foreground">
            Votes are counted in real-time
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Belum Memilih */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Remaining Voters</CardDescription>
          <CardTitle className="min-w-0 font-semibold tabular-nums text-[clamp(1rem,8cqw,1.25rem)]">
            {stats.remainingVoters.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="p-1.5 text-amber-500 border-amber-500/50">
              <IconUserOff className="size-5" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm">
          <div className="text-muted-foreground">
            Waiting for the remaining votes to come in
          </div>
        </CardFooter>
      </Card>

      {/* Card 4: Tingkat Partisipasi */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Participation Rate</CardDescription>
          <CardTitle className="min-w-0 font-semibold tabular-nums text-[clamp(1rem,8cqw,1.25rem)]">
            {stats.participationRate} %
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="p-1.5 text-blue-500 border-blue-500/50">
              <IconPercentage className="size-5" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm">
          <div className="text-muted-foreground">
            participation level measure of success
          </div>
        </CardFooter>
      </Card>
      
    </div>
  )
}