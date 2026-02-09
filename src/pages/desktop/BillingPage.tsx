import { Check } from "lucide-react";
import { Navbar } from "@/components/desktop/Navbar";
import { Button } from "@/components/ui/button";
import { plans, currentPlan } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BillingPage() {
  const handleUpgrade = (planId: string) => {
    if (planId === currentPlan) return;
    toast.success("Upgrade initiated", {
      description: "Redirecting to checkout...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-[1440px] px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Billing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your subscription and billing details
          </p>
        </div>

        {/* Current Plan Banner */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-6 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current plan</p>
              <p className="font-display text-lg font-semibold text-foreground mt-0.5">
                Pro Plan
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next billing date</p>
              <p className="text-sm font-medium text-foreground mt-0.5">March 1, 2026</p>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-lg border bg-card p-6 flex flex-col",
                  plan.highlighted
                    ? "border-primary ring-1 ring-primary"
                    : "border-border"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mt-3">
                    <span className="font-mono text-4xl font-semibold text-foreground">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-muted-foreground ml-1">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrent ? "outline" : plan.highlighted ? "default" : "outline"}
                  className="w-full"
                  disabled={isCurrent}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrent ? "Current Plan" : plan.price === 0 ? "Downgrade" : "Upgrade"}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Payment Method Section */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">
            Payment Method
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-16 items-center justify-center rounded border border-border bg-muted">
                <span className="text-xs font-bold text-foreground">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </div>

        {/* Billing History */}
        <div className="mt-8 rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-display text-base font-semibold text-foreground">
              Billing History
            </h3>
          </div>
          <div className="divide-y divide-border">
            {[
              { date: "Feb 1, 2026", amount: "$29.00", status: "Paid" },
              { date: "Jan 1, 2026", amount: "$29.00", status: "Paid" },
              { date: "Dec 1, 2025", amount: "$29.00", status: "Paid" },
            ].map((invoice, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{invoice.date}</p>
                  <p className="text-xs text-muted-foreground">Pro Plan - Monthly</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-foreground">{invoice.amount}</span>
                  <span className="inline-flex items-center rounded-full bg-[hsl(var(--success))]/10 px-2.5 py-1 text-xs font-medium text-[hsl(var(--success))]">
                    {invoice.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}