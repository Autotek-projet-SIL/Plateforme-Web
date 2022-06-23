const privateSecret = "whb3ggyqIy4DkbFjjx5udxY52siqXhFp3EukGIGR/Zo=";
const privateSecretLength = privateSecret.length;
export const encryptData = (string) => {
  if (string.length === 0) return "";

  /** Step1: Get first character from private secret and add to `encryptedString` */
  let encryptedString = privateSecret.split("")[0];

  /** Step2: Make String as array and secret as array */
  let stringParts = string.split("");
  let secretParts = privateSecret.split("");

  let i = 0;
  while (stringParts.length > secretParts.length) {
    secretParts = secretParts + secretParts[i];
    i++;
    if (i === secretParts.length) {
      i = 0;
    }
  }
  /** Step3: Concat string parts with the private secret parts */
  for (let i = 0; i < secretParts.length; i++) {
    const text = secretParts[i];

    encryptedString += text;

    if (typeof stringParts[i] !== "undefined") {
      encryptedString += stringParts[i];
    }
  }

  return encryptedString;
};

export const decryptData = (string) => {
  if (string.length === 0) return "";

  const encryptedStringParts = string.split("");
  const startLength = 2;

  /** Step1: Calculate `encryptStringLength` total - ( startLength + secret length) */
  let encryptedLength =
    encryptedStringParts.length - (startLength + privateSecretLength) + 1;

  /** Step2: Replace array by deleting before it's index */
  encryptedStringParts.splice(0, startLength);

  /** Step3: Initializes takens data */
  let taken = 0,
    decryptedString = "";

  /** Step4: for i to encryptStringLength length, replace actual string */
  for (let i = 0; i < encryptedStringParts.length; i++) {
    const ep = encryptedStringParts[i];
    if (i % 2 === 0 && taken < encryptedLength) {
      decryptedString += ep;
      taken++;
    }
  }
  return decryptedString;
};
