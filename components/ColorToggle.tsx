"use client";

import { colorSets } from "@/common/cards";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from "@/convex/_generated/api";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ColorToggle() {
  const user = useQuery(api.users.viewer, {});
  const setColor = useMutation(api.profile.setColors);
  const [colorPalette, setColorPalette] = useState(
    user?.colorPalette || "default",
  );
  const router = useRouter();

  return (
    <ToggleGroup
      type="single"
      size="sm"
      onValueChange={(value) => {
        setColorPalette(value);
        setColor({ colorPalette: value });
        router.refresh();
      }}
      dir="ltr"
      value={colorPalette}
    >
      {Object.entries(colorSets).map(([key, colors]) => {
        return (
          <ToggleGroupItem value={key} aria-label={key} key={key}>
            {(["Red", "Green", "Purple"] as const).map((color) => {
              return (
                <div
                  key={color}
                  style={{
                    backgroundColor: colors[color],
                  }}
                  className={`w-4 h-4`}
                ></div>
              );
            })}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
