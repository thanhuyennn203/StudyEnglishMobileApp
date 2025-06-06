// components/CustomText.tsx
import React from "react";
import { Text as RNText, TextProps } from "react-native";

const CustomText: React.FC<TextProps> = (props) => {
  return (
    <RNText
      {...props}
      style={[
        {
          fontFamily: "Baloo2_600SemiBold",
          fontSize: 18,
        },
        props.style,
      ]}
    />
  );
};

export default CustomText;
