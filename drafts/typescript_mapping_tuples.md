```ts
interface MyInterface {
    a: string
}

interface MyInterface {
    b: number
}

/**
 * Results in
 * interface MyInterface {
 *   a: string
 *   b: string
 * }
 */

type Box<T> = { value: T }

type OriginalObject = {
    a: string
    b: number
    c: boolean
}

type BoxedObject = {
    [T in keyof OriginalObject]: Box<T>
}

type OriginalTuple = [string, number, boolean]
type keys = Exclude<keyof OriginalTuple, keyof any[]>
type BoxedTuple = {
    [T in Exclude<keyof OriginalTuple, keyof any[]>]: Box<OriginalTuple[T]>
} & any[] & { length: OriginalTuple["length"] }
declare const tuple: BoxedTuple
tuple.includes("")
const [str, num, bool] = tuple
for (const x of tuple) {

}
```

https://stackoverflow.com/questions/51672504/how-to-map-a-tuple-to-another-tuple-type-in-typescript-3-0
https://github.com/Microsoft/TypeScript/issues/25947
https://github.com/microsoft/TypeScript/pull/26063
