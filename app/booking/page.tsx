"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookingProgressBar,
  BookingContainer,
} from "@/components/booking/BookingProgressBar";
import { SizeSelection } from "@/components/booking/SizeSelection";
import { FormActions } from "@/components/booking/FormComponents";
import { MOCK_SIZES } from "@/app/booking/mock-data";

const STEPS = [
  { name: "size", label: "Size" },
  { name: "dates", label: "Dates" },
  { name: "address", label: "Address" },
  { name: "details", label: "Info" },
  { name: "review", label: "Review" },
];

export default function BookingSizePage() {
  const router = useRouter();
  const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSize = (sizeId: string) => {
    setSelectedSizeId(sizeId);
  };

  const handleContinue = async () => {
    if (!selectedSizeId) return;

    setIsLoading(true);
    try {
      // Store selected size in session/state
      // TODO: Use server action or context to persist state
      sessionStorage.setItem("booking_size_id", selectedSizeId);

      // Navigate to next step
      router.push("/booking/dates");
    } catch (error) {
      console.error("Error selecting size:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BookingContainer
      title="Choose Your Dumpster Size"
      description="Select the right size for your project. Not sure? Our team can help!"
      showHeader={true}
    >
      <BookingProgressBar
        currentStep={0}
        totalSteps={STEPS.length}
        steps={STEPS}
      />

      <div className="mb-8">
        <SizeSelection
          sizes={MOCK_SIZES}
          selectedSizeId={selectedSizeId}
          onSelect={handleSelectSize}
        />
      </div>

      <FormActions
        onNext={handleContinue}
        nextLabel="Continue to Dates"
        nextDisabled={!selectedSizeId}
        isLoading={isLoading}
      />
    </BookingContainer>
  );
}
