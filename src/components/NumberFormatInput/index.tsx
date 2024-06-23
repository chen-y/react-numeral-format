import { useEffect, useState, useMemo } from "react";

const isEmpty = (v: any) => v === "";
const isZero = (v: any) => v === 0;
const isNull = (v: any) => v === null;
const isUndefined = (v: any) => v === undefined;
const isNullable = (v: any) => isNull(v) || isUndefined(v);

const getReNum = ({
  decimalScale,
  intScale,
}: {
  decimalScale?: number;
  intScale?: number;
}) => {
  const isValid = (v: any) => !isNullable(v) && !isEmpty(v);
  const dScale = isValid(decimalScale) ? `{0,${decimalScale}}` : "*";
  const iScale = isValid(intScale) ? `{1,${intScale}}` : "+";

  const re = new RegExp(`^\\d${iScale}(\\.\\d${dScale})?$`);
  return re;
};

const reNum = getReNum({});
const isNumber = (v: any) => reNum.test(v);

const format = (value: string | number): string => {
  if (value) {
    const str = value.toString();
    const [int, decimal] = str.split(".");
    const firstChar = str.charAt(0);

    const isNegative = firstChar === "-";
    let realInt = int;
    if (isNegative) {
      realInt = int.substring(1);
    }

    const replacedInt = realInt.replace(/(\d)(?=(\d{3})+$)/g, "$1,");

    const d = decimal ? `.${decimal}` : "";
    const returnVal = `${isNegative ? firstChar : ""}${replacedInt}${d}`;
    return returnVal;
  }

  return "";
};

const reFormat = (value: string) => {
  const s1 = value.replace(/,/g, "");
  return s1;
};

export interface IProps {
  max?: number;
  min?: number;
  value?: string | number;
  decimalScale?: number;
  intScale?: number;
  onChange?: (
    values: { rawValue: string; formatValue: string },
    evt: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function NumberFormatInput(props: IProps) {
  const { value, min, max, onChange, decimalScale, intScale } = props;
  const [formatValue, setFormatValue] = useState<string>("");

  const configReNum = useMemo(() => {
    const re = getReNum({ decimalScale, intScale });
    console.info(re);
    return re;
  }, [decimalScale, intScale]);

  const internalChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    if (value) {
      // 使用洋葱模型处理
      const replacedValue = reFormat(value);

      if (configReNum.test(replacedValue)) {
        const replacedNum = Number(replacedValue);

        if (isNumber(max)) {
          if (replacedNum > max) {
            setFormatValue(max.toString());
            return;
          }
        }

        setFormatValue(replacedValue);
      }

      // 1,333,333.000001;
    } else {
      setFormatValue("");
    }
    // console.info(value);
    // setFormatValue();
  };

  useEffect(() => {
    // replace
  }, [value]);

  return <input type="text" value={formatValue} onChange={internalChange} />;
}
