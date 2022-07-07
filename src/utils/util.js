
import numeral from "numeral";

export const sortData = (data) => {
  const sortedData = [...data].sort((a, b) => b.cases - a.cases);
  return sortedData;
};

export const prettyPrintStat = (stat) =>{
    return stat ? `+${numeral(stat).format("0.0a")}` : "+0";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}