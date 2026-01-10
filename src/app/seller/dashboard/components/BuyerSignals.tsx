"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { BuyerSignal } from "@/types/sellerDashboard";

interface BuyerSignalsProps {
  signals: BuyerSignal[];
}

export default function BuyerSignals({ signals }: BuyerSignalsProps) {
  const getSignalIcon = (type: BuyerSignal["type"]) => {
    switch (type) {
      case "comparing":
        return Users;
      case "pro_interest":
        return ShieldCheck;
      case "price_sensitivity":
        return DollarSign;
    }
  };

  const getSignalColor = (type: BuyerSignal["type"]) => {
    switch (type) {
      case "comparing":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "pro_interest":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "price_sensitivity":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
  };

  if (signals.length === 0) {
    return null;
  }

  return (
    <Card className="border-slate-800 bg-[#0B1221]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Buyer Signals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {signals.map((signal, index) => {
            const Icon = getSignalIcon(signal.type);
            return (
              <Card
                key={index}
                className={`border-slate-800 bg-slate-900/20 ${getSignalColor(signal.type)}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{signal.label}</span>
                  </div>
                  <p className="text-sm opacity-90">{signal.message}</p>
                  {signal.count && (
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-white border-white/20"
                    >
                      {signal.count} {signal.count === 1 ? "buyer" : "buyers"}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Soft Monetization Triggers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
          <Link href="/pricing">
            <Button
              variant="outline"
              className="w-full border-blue-500/20 text-blue-400 hover:bg-blue-500/10 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Boost Visibility
            </Button>
          </Link>
          <Link href="/trust/verification">
            <Button
              variant="outline"
              className="w-full border-purple-500/20 text-purple-400 hover:bg-purple-500/10 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Get Verified
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
