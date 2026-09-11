import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare } from 'lucide-react';
import { ratingApi } from '../services/rating.api';

export const RatingModal = ({ isOpen, onClose, shipmentId, tripId, toUserId, partnerName, partnerRole, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await ratingApi.submitRating({
        toUser: toUserId,
        shipment: shipmentId,
        trip: tripId,
        role: partnerRole || 'CARRIER',
        rating,
        review
      });

      setSuccess(true);
      if (onSubmitted) onSubmitted();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
      <div className="bg-slate-800 border-2 border-amber-500/50 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5 text-white overflow-hidden text-center">
        {/* Top glowing bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-3xl mx-auto shadow-lg shadow-amber-500/10">
          ⭐
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 font-outfit">
            SHIPMENT DELIVERED ✓
          </span>
          <h3 className="text-xl font-extrabold text-white font-outfit mt-1">Rate Your Experience</h3>
          <p className="text-xs text-slate-300">How was working with <strong>{partnerName || 'Partner'}</strong>?</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-left">
            ⚠️ {error}
          </div>
        )}

        {success ? (
          <div className="py-6 space-y-2">
            <CheckCircle2 size={44} className="text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-white font-outfit">Rating Submitted!</h4>
            <p className="text-xs text-slate-300">Thank you for building trust on BACKTRACKING.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Interactive 5 Star Selector */}
            <div className="flex justify-center items-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-3xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-slate-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            <div className="text-xs text-amber-300 font-extrabold font-outfit">
              {rating === 5 ? '🌟 Exceptional Service' : rating === 4 ? '👍 Very Good' : rating === 3 ? '👌 Average' : '⚠️ Below Expectations'}
            </div>

            {/* Optional Review Textarea */}
            <div>
              <textarea
                rows={3}
                placeholder="Share your experience (on-time status, vehicle condition, communication)..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Rating...' : 'Submit Rating & Update Trust Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
