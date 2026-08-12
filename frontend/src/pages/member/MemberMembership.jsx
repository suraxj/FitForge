import React, { useState, useEffect } from 'react';
import { membershipService } from '../../services/membershipService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  CreditCard,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const MemberMembership = () => {
  const [loading, setLoading] = useState(true);
  const [myMembership, setMyMembership] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchMembershipInfo = async () => {
      setLoading(true);
      try {
        const [myRes, plansRes] = await Promise.allSettled([
          membershipService.getMyMembership(),
          membershipService.getPlans()
        ]);

        if (myRes.status === 'fulfilled' && myRes.value.success) {
          setMyMembership(myRes.value.data);
        }
        if (plansRes.status === 'fulfilled' && plansRes.value?.success) {
          setPlans(Array.isArray(plansRes.value.data) ? plansRes.value.data : []);
        }
      } catch (err) {
        console.error('Error fetching membership info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipInfo();
  }, []);

  const handleRequestPlan = (planName) => {
    toast.success(`Plan request submitted for ${planName}! Gym admin will reach out to activate.`);
  };

  if (loading) {
    return <Loader message="Loading membership options..." />;
  }

  const safePlans = Array.isArray(plans) ? plans : [];

  // Calculate duration metrics
  let daysRemaining = 0;
  let percentRemaining = 0;
  if (myMembership && myMembership.startDate && myMembership.endDate) {
    const start = new Date(myMembership.startDate).getTime();
    const end = new Date(myMembership.endDate).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    if (totalDuration > 0) {
      percentRemaining = Math.max(0, Math.min(100, ((end - now) / totalDuration) * 100));
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Membership & Plans</h1>
        <p className="text-xs text-slate-400 mt-1">
          View active gym subscription, plan benefits, and explore available membership tiers.
        </p>
      </div>

      {/* Active Membership Status Card */}
      {myMembership ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active Subscription</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">{myMembership.plan?.name || 'Gym Access Plan'}</h2>
              <p className="text-sm text-slate-400 mt-1">{myMembership.plan?.description || 'Unlimited gym access & equipment usage'}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-xs text-slate-400 font-semibold block">Plan Price</span>
                <span className="text-2xl font-black text-amber-400">${myMembership.plan?.price || 0}</span>
                <span className="text-xs text-slate-500 font-medium">/{myMembership.plan?.durationMonths || 1} mo</span>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                myMembership.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {myMembership.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Start Date</p>
                <p className="text-sm font-bold text-white">{new Date(myMembership.startDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Expiry Date</p>
                <p className="text-sm font-bold text-white">{new Date(myMembership.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Remaining</p>
                <p className="text-sm font-bold text-amber-400">{daysRemaining} Days</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-semibold">
              <span>Subscription Progress</span>
              <span>{Math.round(percentRemaining)}% Remaining</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${percentRemaining}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">No Active Gym Membership</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            You do not currently have an active gym membership subscription. Browse our plans below to get started.
          </p>
        </div>
      )}

      {/* Available Plans Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Explore Membership Plans</h2>
          </div>
          <span className="text-xs text-slate-400">Select a plan to request upgrade/renewal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safePlans.map((plan) => {
            const isCurrent = myMembership?.plan?._id === plan._id;

            return (
              <div
                key={plan._id}
                className={`relative flex flex-col justify-between rounded-2xl bg-slate-900 p-6 border transition-all duration-300 ${
                  isCurrent
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase">
                    Current Plan
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-extrabold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

                  <div className="my-6">
                    <span className="text-3xl font-black text-amber-400">${plan.price}</span>
                    <span className="text-xs text-slate-400 font-semibold"> / {plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Plan Highlights:</p>
                    {(plan.features || ['Full gym access', 'Locker & shower facilities', 'Trainer guidance']).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleRequestPlan(plan.name)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MemberMembership;
