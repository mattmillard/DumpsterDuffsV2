"use client";

import { useState, useEffect } from "react";

type InventoryModalProps = {
  inventory: {
    id: string;
    name: string;
    total_units: number;
    available_units: number;
    is_active: boolean;
  } | null;
  onClose: () => void;
  onSave: (updated: {
    id: string;
    name: string;
    total_units: number;
    available_units: number;
    is_active: boolean;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
};

export function InventoryModal({
  inventory,
  onClose,
  onSave,
  onDelete,
}: InventoryModalProps) {
  const [name, setName] = useState("");
  const [totalUnits, setTotalUnits] = useState(0);
  const [availableUnits, setAvailableUnits] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [backdropPointerDown, setBackdropPointerDown] = useState(false);

  useEffect(() => {
    if (inventory) {
      setName(inventory.name);
      setTotalUnits(inventory.total_units);
      setAvailableUnits(inventory.available_units);
      setIsActive(inventory.is_active);
    }
  }, [inventory]);

  if (!inventory) return null;

  const handleBackdropMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    setBackdropPointerDown(event.target === event.currentTarget);
  };

  const handleBackdropMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const endedOnBackdrop = event.target === event.currentTarget;
    if (backdropPointerDown && endedOnBackdrop) {
      onClose();
    }
    setBackdropPointerDown(false);
  };

  const handleSave = async () => {
    setError("");

    if (totalUnits < 0 || availableUnits < 0) {
      setError("Units cannot be negative");
      return;
    }

    if (availableUnits > totalUnits) {
      setError("Available units cannot exceed total units");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        id: inventory.id,
        name,
        total_units: totalUnits,
        available_units: availableUnits,
        is_active: isActive,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(inventory.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onMouseDown={handleBackdropMouseDown}
      onMouseUp={handleBackdropMouseUp}
    >
      <div
        className="bg-[#1A1A1A] border border-[#404040] rounded-lg max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Inventory</h2>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Size Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="e.g., 15 Yard"
            />
          </div>

          {/* Total Units */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Total Units
            </label>
            <input
              type="number"
              min="0"
              value={totalUnits}
              onChange={(e) => setTotalUnits(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Available Units */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Available Units
            </label>
            <input
              type="number"
              min="0"
              max={totalUnits}
              value={availableUnits}
              onChange={(e) => setAvailableUnits(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-[#999999] mt-1">
              In Use: {totalUnits - availableUnits} units
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active-status"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="active-status" className="text-white">
              Active (Available for bookings)
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#404040]">
          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting || isSaving}
              className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}

          {/* Right Actions */}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              disabled={isSaving || isDeleting}
              className="px-4 py-2 bg-[#0F0F0F] text-[#999999] border border-[#404040] rounded-lg hover:text-white hover:border-[#666666] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
