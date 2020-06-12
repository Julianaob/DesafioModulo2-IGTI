import express from "express";

function summation(value){
  const sumValue = value.reduce((acumulator, current) => {
    return acumulator + current;
    
  }, 0);
  return sumValue;
}

function calcAverage(value){
    const sum = summation(value);
  const average = sum / value.length;
  return average;
}

export default {calcAverage, summation};