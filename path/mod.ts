import {
  basename,
  DELIMITER,
  dirname,
  extname,
  format,
  isAbsolute,
  join,
  normalize,
  parse,
  relative,
  resolve,
  SEPARATOR,
} from "@std/path";

export const path = {
  join,
  basename,
  dirname,
  extname,
  normalize,
  relative,
  resolve,
  isAbsolute,
  parse,
  format,
  sep: SEPARATOR,
  delimiter: DELIMITER,
};

export type Path = typeof path;
