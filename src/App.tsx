import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { NumericFormat } from "react-number-format";
import NumberFormatInput from "./components/NumberFormatInput";

function App() {
  const [value, setValue] = useState<number>();

  return (
    <>
      <NumericFormat
        value={value}
        decimalScale={9}
        onValueChange={(values, sourceInfo) => {
          console.info(values, sourceInfo);
          if (values.floatValue! > 200000) {
            setValue(200000);
          }
        }}
        // isAllowed={(values) => {
        //   console.info(values);
        //   if (values.floatValue) {
        //     return values.floatValue <= 200000;
        //   }
        //   return true;
        // }}
      />

      <div>
        <NumberFormatInput />
      </div>
    </>
  );
}

export default App;
