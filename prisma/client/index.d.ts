
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model clubs
 * 
 */
export type clubs = $Result.DefaultSelection<Prisma.$clubsPayload>
/**
 * Model CreatePost
 * 
 */
export type CreatePost = $Result.DefaultSelection<Prisma.$CreatePostPayload>
/**
 * Model speakers
 * 
 */
export type speakers = $Result.DefaultSelection<Prisma.$speakersPayload>
/**
 * Model event
 * 
 */
export type event = $Result.DefaultSelection<Prisma.$eventPayload>
/**
 * Model eventAnnouncement
 * 
 */
export type eventAnnouncement = $Result.DefaultSelection<Prisma.$eventAnnouncementPayload>
/**
 * Model eventGallery
 * 
 */
export type eventGallery = $Result.DefaultSelection<Prisma.$eventGalleryPayload>
/**
 * Model clubAnnouncement
 * 
 */
export type clubAnnouncement = $Result.DefaultSelection<Prisma.$clubAnnouncementPayload>
/**
 * Model userEvents
 * 
 */
export type userEvents = $Result.DefaultSelection<Prisma.$userEventsPayload>
/**
 * Model PostUpvote
 * 
 */
export type PostUpvote = $Result.DefaultSelection<Prisma.$PostUpvotePayload>
/**
 * Model PostDownvote
 * 
 */
export type PostDownvote = $Result.DefaultSelection<Prisma.$PostDownvotePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const clubType: {
  Technology: 'Technology',
  Cultural: 'Cultural',
  Business: 'Business',
  Social: 'Social',
  Literature: 'Literature',
  Design: 'Design',
  General: 'General'
};

export type clubType = (typeof clubType)[keyof typeof clubType]

}

export type clubType = $Enums.clubType

export const clubType: typeof $Enums.clubType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clubs`: Exposes CRUD operations for the **clubs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clubs
    * const clubs = await prisma.clubs.findMany()
    * ```
    */
  get clubs(): Prisma.clubsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.createPost`: Exposes CRUD operations for the **CreatePost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CreatePosts
    * const createPosts = await prisma.createPost.findMany()
    * ```
    */
  get createPost(): Prisma.CreatePostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.speakers`: Exposes CRUD operations for the **speakers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Speakers
    * const speakers = await prisma.speakers.findMany()
    * ```
    */
  get speakers(): Prisma.speakersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.eventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eventAnnouncement`: Exposes CRUD operations for the **eventAnnouncement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventAnnouncements
    * const eventAnnouncements = await prisma.eventAnnouncement.findMany()
    * ```
    */
  get eventAnnouncement(): Prisma.eventAnnouncementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eventGallery`: Exposes CRUD operations for the **eventGallery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventGalleries
    * const eventGalleries = await prisma.eventGallery.findMany()
    * ```
    */
  get eventGallery(): Prisma.eventGalleryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clubAnnouncement`: Exposes CRUD operations for the **clubAnnouncement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClubAnnouncements
    * const clubAnnouncements = await prisma.clubAnnouncement.findMany()
    * ```
    */
  get clubAnnouncement(): Prisma.clubAnnouncementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userEvents`: Exposes CRUD operations for the **userEvents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserEvents
    * const userEvents = await prisma.userEvents.findMany()
    * ```
    */
  get userEvents(): Prisma.userEventsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.postUpvote`: Exposes CRUD operations for the **PostUpvote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PostUpvotes
    * const postUpvotes = await prisma.postUpvote.findMany()
    * ```
    */
  get postUpvote(): Prisma.PostUpvoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.postDownvote`: Exposes CRUD operations for the **PostDownvote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PostDownvotes
    * const postDownvotes = await prisma.postDownvote.findMany()
    * ```
    */
  get postDownvote(): Prisma.PostDownvoteDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.0
   * Query Engine version: ab56fe763f921d033a6c195e7ddeb3e255bdbb57
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    clubs: 'clubs',
    CreatePost: 'CreatePost',
    speakers: 'speakers',
    event: 'event',
    eventAnnouncement: 'eventAnnouncement',
    eventGallery: 'eventGallery',
    clubAnnouncement: 'clubAnnouncement',
    userEvents: 'userEvents',
    PostUpvote: 'PostUpvote',
    PostDownvote: 'PostDownvote'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "clubs" | "createPost" | "speakers" | "event" | "eventAnnouncement" | "eventGallery" | "clubAnnouncement" | "userEvents" | "postUpvote" | "postDownvote"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      clubs: {
        payload: Prisma.$clubsPayload<ExtArgs>
        fields: Prisma.clubsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.clubsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.clubsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>
          }
          findFirst: {
            args: Prisma.clubsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.clubsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>
          }
          findMany: {
            args: Prisma.clubsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>[]
          }
          create: {
            args: Prisma.clubsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>
          }
          createMany: {
            args: Prisma.clubsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.clubsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>[]
          }
          delete: {
            args: Prisma.clubsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>
          }
          update: {
            args: Prisma.clubsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>
          }
          deleteMany: {
            args: Prisma.clubsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.clubsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.clubsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>[]
          }
          upsert: {
            args: Prisma.clubsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubsPayload>
          }
          aggregate: {
            args: Prisma.ClubsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClubs>
          }
          groupBy: {
            args: Prisma.clubsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClubsGroupByOutputType>[]
          }
          count: {
            args: Prisma.clubsCountArgs<ExtArgs>
            result: $Utils.Optional<ClubsCountAggregateOutputType> | number
          }
        }
      }
      CreatePost: {
        payload: Prisma.$CreatePostPayload<ExtArgs>
        fields: Prisma.CreatePostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CreatePostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CreatePostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>
          }
          findFirst: {
            args: Prisma.CreatePostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CreatePostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>
          }
          findMany: {
            args: Prisma.CreatePostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>[]
          }
          create: {
            args: Prisma.CreatePostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>
          }
          createMany: {
            args: Prisma.CreatePostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CreatePostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>[]
          }
          delete: {
            args: Prisma.CreatePostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>
          }
          update: {
            args: Prisma.CreatePostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>
          }
          deleteMany: {
            args: Prisma.CreatePostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CreatePostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CreatePostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>[]
          }
          upsert: {
            args: Prisma.CreatePostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreatePostPayload>
          }
          aggregate: {
            args: Prisma.CreatePostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCreatePost>
          }
          groupBy: {
            args: Prisma.CreatePostGroupByArgs<ExtArgs>
            result: $Utils.Optional<CreatePostGroupByOutputType>[]
          }
          count: {
            args: Prisma.CreatePostCountArgs<ExtArgs>
            result: $Utils.Optional<CreatePostCountAggregateOutputType> | number
          }
        }
      }
      speakers: {
        payload: Prisma.$speakersPayload<ExtArgs>
        fields: Prisma.speakersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.speakersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.speakersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>
          }
          findFirst: {
            args: Prisma.speakersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.speakersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>
          }
          findMany: {
            args: Prisma.speakersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>[]
          }
          create: {
            args: Prisma.speakersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>
          }
          createMany: {
            args: Prisma.speakersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.speakersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>[]
          }
          delete: {
            args: Prisma.speakersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>
          }
          update: {
            args: Prisma.speakersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>
          }
          deleteMany: {
            args: Prisma.speakersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.speakersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.speakersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>[]
          }
          upsert: {
            args: Prisma.speakersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$speakersPayload>
          }
          aggregate: {
            args: Prisma.SpeakersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpeakers>
          }
          groupBy: {
            args: Prisma.speakersGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpeakersGroupByOutputType>[]
          }
          count: {
            args: Prisma.speakersCountArgs<ExtArgs>
            result: $Utils.Optional<SpeakersCountAggregateOutputType> | number
          }
        }
      }
      event: {
        payload: Prisma.$eventPayload<ExtArgs>
        fields: Prisma.eventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.eventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.eventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>
          }
          findFirst: {
            args: Prisma.eventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.eventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>
          }
          findMany: {
            args: Prisma.eventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>[]
          }
          create: {
            args: Prisma.eventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>
          }
          createMany: {
            args: Prisma.eventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.eventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>[]
          }
          delete: {
            args: Prisma.eventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>
          }
          update: {
            args: Prisma.eventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>
          }
          deleteMany: {
            args: Prisma.eventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.eventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.eventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>[]
          }
          upsert: {
            args: Prisma.eventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.eventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.eventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      eventAnnouncement: {
        payload: Prisma.$eventAnnouncementPayload<ExtArgs>
        fields: Prisma.eventAnnouncementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.eventAnnouncementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.eventAnnouncementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>
          }
          findFirst: {
            args: Prisma.eventAnnouncementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.eventAnnouncementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>
          }
          findMany: {
            args: Prisma.eventAnnouncementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>[]
          }
          create: {
            args: Prisma.eventAnnouncementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>
          }
          createMany: {
            args: Prisma.eventAnnouncementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.eventAnnouncementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>[]
          }
          delete: {
            args: Prisma.eventAnnouncementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>
          }
          update: {
            args: Prisma.eventAnnouncementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>
          }
          deleteMany: {
            args: Prisma.eventAnnouncementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.eventAnnouncementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.eventAnnouncementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>[]
          }
          upsert: {
            args: Prisma.eventAnnouncementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventAnnouncementPayload>
          }
          aggregate: {
            args: Prisma.EventAnnouncementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventAnnouncement>
          }
          groupBy: {
            args: Prisma.eventAnnouncementGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventAnnouncementGroupByOutputType>[]
          }
          count: {
            args: Prisma.eventAnnouncementCountArgs<ExtArgs>
            result: $Utils.Optional<EventAnnouncementCountAggregateOutputType> | number
          }
        }
      }
      eventGallery: {
        payload: Prisma.$eventGalleryPayload<ExtArgs>
        fields: Prisma.eventGalleryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.eventGalleryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.eventGalleryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>
          }
          findFirst: {
            args: Prisma.eventGalleryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.eventGalleryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>
          }
          findMany: {
            args: Prisma.eventGalleryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>[]
          }
          create: {
            args: Prisma.eventGalleryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>
          }
          createMany: {
            args: Prisma.eventGalleryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.eventGalleryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>[]
          }
          delete: {
            args: Prisma.eventGalleryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>
          }
          update: {
            args: Prisma.eventGalleryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>
          }
          deleteMany: {
            args: Prisma.eventGalleryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.eventGalleryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.eventGalleryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>[]
          }
          upsert: {
            args: Prisma.eventGalleryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventGalleryPayload>
          }
          aggregate: {
            args: Prisma.EventGalleryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventGallery>
          }
          groupBy: {
            args: Prisma.eventGalleryGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGalleryGroupByOutputType>[]
          }
          count: {
            args: Prisma.eventGalleryCountArgs<ExtArgs>
            result: $Utils.Optional<EventGalleryCountAggregateOutputType> | number
          }
        }
      }
      clubAnnouncement: {
        payload: Prisma.$clubAnnouncementPayload<ExtArgs>
        fields: Prisma.clubAnnouncementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.clubAnnouncementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.clubAnnouncementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>
          }
          findFirst: {
            args: Prisma.clubAnnouncementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.clubAnnouncementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>
          }
          findMany: {
            args: Prisma.clubAnnouncementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>[]
          }
          create: {
            args: Prisma.clubAnnouncementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>
          }
          createMany: {
            args: Prisma.clubAnnouncementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.clubAnnouncementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>[]
          }
          delete: {
            args: Prisma.clubAnnouncementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>
          }
          update: {
            args: Prisma.clubAnnouncementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>
          }
          deleteMany: {
            args: Prisma.clubAnnouncementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.clubAnnouncementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.clubAnnouncementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>[]
          }
          upsert: {
            args: Prisma.clubAnnouncementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$clubAnnouncementPayload>
          }
          aggregate: {
            args: Prisma.ClubAnnouncementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClubAnnouncement>
          }
          groupBy: {
            args: Prisma.clubAnnouncementGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClubAnnouncementGroupByOutputType>[]
          }
          count: {
            args: Prisma.clubAnnouncementCountArgs<ExtArgs>
            result: $Utils.Optional<ClubAnnouncementCountAggregateOutputType> | number
          }
        }
      }
      userEvents: {
        payload: Prisma.$userEventsPayload<ExtArgs>
        fields: Prisma.userEventsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userEventsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userEventsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>
          }
          findFirst: {
            args: Prisma.userEventsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userEventsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>
          }
          findMany: {
            args: Prisma.userEventsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>[]
          }
          create: {
            args: Prisma.userEventsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>
          }
          createMany: {
            args: Prisma.userEventsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.userEventsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>[]
          }
          delete: {
            args: Prisma.userEventsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>
          }
          update: {
            args: Prisma.userEventsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>
          }
          deleteMany: {
            args: Prisma.userEventsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userEventsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.userEventsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>[]
          }
          upsert: {
            args: Prisma.userEventsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userEventsPayload>
          }
          aggregate: {
            args: Prisma.UserEventsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserEvents>
          }
          groupBy: {
            args: Prisma.userEventsGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserEventsGroupByOutputType>[]
          }
          count: {
            args: Prisma.userEventsCountArgs<ExtArgs>
            result: $Utils.Optional<UserEventsCountAggregateOutputType> | number
          }
        }
      }
      PostUpvote: {
        payload: Prisma.$PostUpvotePayload<ExtArgs>
        fields: Prisma.PostUpvoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostUpvoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostUpvoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>
          }
          findFirst: {
            args: Prisma.PostUpvoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostUpvoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>
          }
          findMany: {
            args: Prisma.PostUpvoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>[]
          }
          create: {
            args: Prisma.PostUpvoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>
          }
          createMany: {
            args: Prisma.PostUpvoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostUpvoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>[]
          }
          delete: {
            args: Prisma.PostUpvoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>
          }
          update: {
            args: Prisma.PostUpvoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>
          }
          deleteMany: {
            args: Prisma.PostUpvoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpvoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostUpvoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>[]
          }
          upsert: {
            args: Prisma.PostUpvoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostUpvotePayload>
          }
          aggregate: {
            args: Prisma.PostUpvoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePostUpvote>
          }
          groupBy: {
            args: Prisma.PostUpvoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostUpvoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostUpvoteCountArgs<ExtArgs>
            result: $Utils.Optional<PostUpvoteCountAggregateOutputType> | number
          }
        }
      }
      PostDownvote: {
        payload: Prisma.$PostDownvotePayload<ExtArgs>
        fields: Prisma.PostDownvoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostDownvoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostDownvoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>
          }
          findFirst: {
            args: Prisma.PostDownvoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostDownvoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>
          }
          findMany: {
            args: Prisma.PostDownvoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>[]
          }
          create: {
            args: Prisma.PostDownvoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>
          }
          createMany: {
            args: Prisma.PostDownvoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostDownvoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>[]
          }
          delete: {
            args: Prisma.PostDownvoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>
          }
          update: {
            args: Prisma.PostDownvoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>
          }
          deleteMany: {
            args: Prisma.PostDownvoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostDownvoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostDownvoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>[]
          }
          upsert: {
            args: Prisma.PostDownvoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostDownvotePayload>
          }
          aggregate: {
            args: Prisma.PostDownvoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePostDownvote>
          }
          groupBy: {
            args: Prisma.PostDownvoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostDownvoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostDownvoteCountArgs<ExtArgs>
            result: $Utils.Optional<PostDownvoteCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    clubs?: clubsOmit
    createPost?: CreatePostOmit
    speakers?: speakersOmit
    event?: eventOmit
    eventAnnouncement?: eventAnnouncementOmit
    eventGallery?: eventGalleryOmit
    clubAnnouncement?: clubAnnouncementOmit
    userEvents?: userEventsOmit
    postUpvote?: PostUpvoteOmit
    postDownvote?: PostDownvoteOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    eventAttended: number
    CreatePost: number
    postUpvotes: number
    postDownvotes: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    eventAttended?: boolean | UserCountOutputTypeCountEventAttendedArgs
    CreatePost?: boolean | UserCountOutputTypeCountCreatePostArgs
    postUpvotes?: boolean | UserCountOutputTypeCountPostUpvotesArgs
    postDownvotes?: boolean | UserCountOutputTypeCountPostDownvotesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEventAttendedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userEventsWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatePostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CreatePostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPostUpvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostUpvoteWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPostDownvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostDownvoteWhereInput
  }


  /**
   * Count Type ClubsCountOutputType
   */

  export type ClubsCountOutputType = {
    posts: number
    members: number
    events: number
    announcements: number
  }

  export type ClubsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | ClubsCountOutputTypeCountPostsArgs
    members?: boolean | ClubsCountOutputTypeCountMembersArgs
    events?: boolean | ClubsCountOutputTypeCountEventsArgs
    announcements?: boolean | ClubsCountOutputTypeCountAnnouncementsArgs
  }

  // Custom InputTypes
  /**
   * ClubsCountOutputType without action
   */
  export type ClubsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClubsCountOutputType
     */
    select?: ClubsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClubsCountOutputType without action
   */
  export type ClubsCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CreatePostWhereInput
  }

  /**
   * ClubsCountOutputType without action
   */
  export type ClubsCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * ClubsCountOutputType without action
   */
  export type ClubsCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: eventWhereInput
  }

  /**
   * ClubsCountOutputType without action
   */
  export type ClubsCountOutputTypeCountAnnouncementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: clubAnnouncementWhereInput
  }


  /**
   * Count Type CreatePostCountOutputType
   */

  export type CreatePostCountOutputType = {
    upvotes: number
    downvotes: number
  }

  export type CreatePostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    upvotes?: boolean | CreatePostCountOutputTypeCountUpvotesArgs
    downvotes?: boolean | CreatePostCountOutputTypeCountDownvotesArgs
  }

  // Custom InputTypes
  /**
   * CreatePostCountOutputType without action
   */
  export type CreatePostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePostCountOutputType
     */
    select?: CreatePostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CreatePostCountOutputType without action
   */
  export type CreatePostCountOutputTypeCountUpvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostUpvoteWhereInput
  }

  /**
   * CreatePostCountOutputType without action
   */
  export type CreatePostCountOutputTypeCountDownvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostDownvoteWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    speakers: number
    attendees: number
    announcements: number
    galleries: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    speakers?: boolean | EventCountOutputTypeCountSpeakersArgs
    attendees?: boolean | EventCountOutputTypeCountAttendeesArgs
    announcements?: boolean | EventCountOutputTypeCountAnnouncementsArgs
    galleries?: boolean | EventCountOutputTypeCountGalleriesArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountSpeakersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: speakersWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountAttendeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userEventsWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountAnnouncementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: eventAnnouncementWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountGalleriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: eventGalleryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    expiryToken: number | null
    ValidFor: number | null
  }

  export type UserSumAggregateOutputType = {
    expiryToken: number | null
    ValidFor: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    clerkId: string | null
    email: string | null
    collegeName: string | null
    name: string | null
    profileAvatar: string | null
    password: string | null
    createdAt: Date | null
    vToken: string | null
    expiryToken: number | null
    ValidFor: number | null
    isVerified: boolean | null
    clubName: string | null
    clubId: string | null
    bio: string | null
    course: string | null
    year: string | null
    phone: string | null
    twitter: string | null
    linkedin: string | null
    instagram: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    clerkId: string | null
    email: string | null
    collegeName: string | null
    name: string | null
    profileAvatar: string | null
    password: string | null
    createdAt: Date | null
    vToken: string | null
    expiryToken: number | null
    ValidFor: number | null
    isVerified: boolean | null
    clubName: string | null
    clubId: string | null
    bio: string | null
    course: string | null
    year: string | null
    phone: string | null
    twitter: string | null
    linkedin: string | null
    instagram: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    clerkId: number
    email: number
    collegeName: number
    name: number
    profileAvatar: number
    password: number
    createdAt: number
    vToken: number
    expiryToken: number
    ValidFor: number
    isVerified: number
    clubName: number
    clubId: number
    bio: number
    tags: number
    course: number
    year: number
    phone: number
    twitter: number
    linkedin: number
    instagram: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    expiryToken?: true
    ValidFor?: true
  }

  export type UserSumAggregateInputType = {
    expiryToken?: true
    ValidFor?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    collegeName?: true
    name?: true
    profileAvatar?: true
    password?: true
    createdAt?: true
    vToken?: true
    expiryToken?: true
    ValidFor?: true
    isVerified?: true
    clubName?: true
    clubId?: true
    bio?: true
    course?: true
    year?: true
    phone?: true
    twitter?: true
    linkedin?: true
    instagram?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    collegeName?: true
    name?: true
    profileAvatar?: true
    password?: true
    createdAt?: true
    vToken?: true
    expiryToken?: true
    ValidFor?: true
    isVerified?: true
    clubName?: true
    clubId?: true
    bio?: true
    course?: true
    year?: true
    phone?: true
    twitter?: true
    linkedin?: true
    instagram?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    collegeName?: true
    name?: true
    profileAvatar?: true
    password?: true
    createdAt?: true
    vToken?: true
    expiryToken?: true
    ValidFor?: true
    isVerified?: true
    clubName?: true
    clubId?: true
    bio?: true
    tags?: true
    course?: true
    year?: true
    phone?: true
    twitter?: true
    linkedin?: true
    instagram?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    clerkId: string | null
    email: string
    collegeName: string
    name: string | null
    profileAvatar: string | null
    password: string
    createdAt: Date
    vToken: string | null
    expiryToken: number | null
    ValidFor: number | null
    isVerified: boolean | null
    clubName: string | null
    clubId: string | null
    bio: string | null
    tags: string[]
    course: string | null
    year: string | null
    phone: string | null
    twitter: string | null
    linkedin: string | null
    instagram: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    collegeName?: boolean
    name?: boolean
    profileAvatar?: boolean
    password?: boolean
    createdAt?: boolean
    vToken?: boolean
    expiryToken?: boolean
    ValidFor?: boolean
    isVerified?: boolean
    clubName?: boolean
    clubId?: boolean
    bio?: boolean
    tags?: boolean
    course?: boolean
    year?: boolean
    phone?: boolean
    twitter?: boolean
    linkedin?: boolean
    instagram?: boolean
    eventAttended?: boolean | User$eventAttendedArgs<ExtArgs>
    club?: boolean | User$clubArgs<ExtArgs>
    CreatePost?: boolean | User$CreatePostArgs<ExtArgs>
    postUpvotes?: boolean | User$postUpvotesArgs<ExtArgs>
    postDownvotes?: boolean | User$postDownvotesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    collegeName?: boolean
    name?: boolean
    profileAvatar?: boolean
    password?: boolean
    createdAt?: boolean
    vToken?: boolean
    expiryToken?: boolean
    ValidFor?: boolean
    isVerified?: boolean
    clubName?: boolean
    clubId?: boolean
    bio?: boolean
    tags?: boolean
    course?: boolean
    year?: boolean
    phone?: boolean
    twitter?: boolean
    linkedin?: boolean
    instagram?: boolean
    club?: boolean | User$clubArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    collegeName?: boolean
    name?: boolean
    profileAvatar?: boolean
    password?: boolean
    createdAt?: boolean
    vToken?: boolean
    expiryToken?: boolean
    ValidFor?: boolean
    isVerified?: boolean
    clubName?: boolean
    clubId?: boolean
    bio?: boolean
    tags?: boolean
    course?: boolean
    year?: boolean
    phone?: boolean
    twitter?: boolean
    linkedin?: boolean
    instagram?: boolean
    club?: boolean | User$clubArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    clerkId?: boolean
    email?: boolean
    collegeName?: boolean
    name?: boolean
    profileAvatar?: boolean
    password?: boolean
    createdAt?: boolean
    vToken?: boolean
    expiryToken?: boolean
    ValidFor?: boolean
    isVerified?: boolean
    clubName?: boolean
    clubId?: boolean
    bio?: boolean
    tags?: boolean
    course?: boolean
    year?: boolean
    phone?: boolean
    twitter?: boolean
    linkedin?: boolean
    instagram?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clerkId" | "email" | "collegeName" | "name" | "profileAvatar" | "password" | "createdAt" | "vToken" | "expiryToken" | "ValidFor" | "isVerified" | "clubName" | "clubId" | "bio" | "tags" | "course" | "year" | "phone" | "twitter" | "linkedin" | "instagram", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    eventAttended?: boolean | User$eventAttendedArgs<ExtArgs>
    club?: boolean | User$clubArgs<ExtArgs>
    CreatePost?: boolean | User$CreatePostArgs<ExtArgs>
    postUpvotes?: boolean | User$postUpvotesArgs<ExtArgs>
    postDownvotes?: boolean | User$postDownvotesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | User$clubArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | User$clubArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      eventAttended: Prisma.$userEventsPayload<ExtArgs>[]
      club: Prisma.$clubsPayload<ExtArgs> | null
      CreatePost: Prisma.$CreatePostPayload<ExtArgs>[]
      postUpvotes: Prisma.$PostUpvotePayload<ExtArgs>[]
      postDownvotes: Prisma.$PostDownvotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clerkId: string | null
      email: string
      collegeName: string
      name: string | null
      profileAvatar: string | null
      password: string
      createdAt: Date
      vToken: string | null
      expiryToken: number | null
      ValidFor: number | null
      isVerified: boolean | null
      clubName: string | null
      clubId: string | null
      bio: string | null
      tags: string[]
      course: string | null
      year: string | null
      phone: string | null
      twitter: string | null
      linkedin: string | null
      instagram: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    eventAttended<T extends User$eventAttendedArgs<ExtArgs> = {}>(args?: Subset<T, User$eventAttendedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    club<T extends User$clubArgs<ExtArgs> = {}>(args?: Subset<T, User$clubArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    CreatePost<T extends User$CreatePostArgs<ExtArgs> = {}>(args?: Subset<T, User$CreatePostArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    postUpvotes<T extends User$postUpvotesArgs<ExtArgs> = {}>(args?: Subset<T, User$postUpvotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    postDownvotes<T extends User$postDownvotesArgs<ExtArgs> = {}>(args?: Subset<T, User$postDownvotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly clerkId: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly collegeName: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly profileAvatar: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly vToken: FieldRef<"User", 'String'>
    readonly expiryToken: FieldRef<"User", 'Int'>
    readonly ValidFor: FieldRef<"User", 'Int'>
    readonly isVerified: FieldRef<"User", 'Boolean'>
    readonly clubName: FieldRef<"User", 'String'>
    readonly clubId: FieldRef<"User", 'String'>
    readonly bio: FieldRef<"User", 'String'>
    readonly tags: FieldRef<"User", 'String[]'>
    readonly course: FieldRef<"User", 'String'>
    readonly year: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly twitter: FieldRef<"User", 'String'>
    readonly linkedin: FieldRef<"User", 'String'>
    readonly instagram: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.eventAttended
   */
  export type User$eventAttendedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    where?: userEventsWhereInput
    orderBy?: userEventsOrderByWithRelationInput | userEventsOrderByWithRelationInput[]
    cursor?: userEventsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserEventsScalarFieldEnum | UserEventsScalarFieldEnum[]
  }

  /**
   * User.club
   */
  export type User$clubArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    where?: clubsWhereInput
  }

  /**
   * User.CreatePost
   */
  export type User$CreatePostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    where?: CreatePostWhereInput
    orderBy?: CreatePostOrderByWithRelationInput | CreatePostOrderByWithRelationInput[]
    cursor?: CreatePostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CreatePostScalarFieldEnum | CreatePostScalarFieldEnum[]
  }

  /**
   * User.postUpvotes
   */
  export type User$postUpvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    where?: PostUpvoteWhereInput
    orderBy?: PostUpvoteOrderByWithRelationInput | PostUpvoteOrderByWithRelationInput[]
    cursor?: PostUpvoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostUpvoteScalarFieldEnum | PostUpvoteScalarFieldEnum[]
  }

  /**
   * User.postDownvotes
   */
  export type User$postDownvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    where?: PostDownvoteWhereInput
    orderBy?: PostDownvoteOrderByWithRelationInput | PostDownvoteOrderByWithRelationInput[]
    cursor?: PostDownvoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostDownvoteScalarFieldEnum | PostDownvoteScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model clubs
   */

  export type AggregateClubs = {
    _count: ClubsCountAggregateOutputType | null
    _min: ClubsMinAggregateOutputType | null
    _max: ClubsMaxAggregateOutputType | null
  }

  export type ClubsMinAggregateOutputType = {
    id: string | null
    name: string | null
    founderEmail: string | null
    coremember1: string | null
    coremember2: string | null
    coremember3: string | null
    facultyEmail: string | null
    collegeName: string | null
    collegeId: string | null
    type: string | null
    description: string | null
    requirements: string | null
    profilePicUrl: string | null
    clubContact: string | null
    instagram: string | null
    twitter: string | null
    linkedin: string | null
  }

  export type ClubsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    founderEmail: string | null
    coremember1: string | null
    coremember2: string | null
    coremember3: string | null
    facultyEmail: string | null
    collegeName: string | null
    collegeId: string | null
    type: string | null
    description: string | null
    requirements: string | null
    profilePicUrl: string | null
    clubContact: string | null
    instagram: string | null
    twitter: string | null
    linkedin: string | null
  }

  export type ClubsCountAggregateOutputType = {
    id: number
    name: number
    founderEmail: number
    coremember1: number
    coremember2: number
    coremember3: number
    facultyEmail: number
    collegeName: number
    collegeId: number
    type: number
    description: number
    requirements: number
    profilePicUrl: number
    clubContact: number
    wings: number
    instagram: number
    twitter: number
    linkedin: number
    _all: number
  }


  export type ClubsMinAggregateInputType = {
    id?: true
    name?: true
    founderEmail?: true
    coremember1?: true
    coremember2?: true
    coremember3?: true
    facultyEmail?: true
    collegeName?: true
    collegeId?: true
    type?: true
    description?: true
    requirements?: true
    profilePicUrl?: true
    clubContact?: true
    instagram?: true
    twitter?: true
    linkedin?: true
  }

  export type ClubsMaxAggregateInputType = {
    id?: true
    name?: true
    founderEmail?: true
    coremember1?: true
    coremember2?: true
    coremember3?: true
    facultyEmail?: true
    collegeName?: true
    collegeId?: true
    type?: true
    description?: true
    requirements?: true
    profilePicUrl?: true
    clubContact?: true
    instagram?: true
    twitter?: true
    linkedin?: true
  }

  export type ClubsCountAggregateInputType = {
    id?: true
    name?: true
    founderEmail?: true
    coremember1?: true
    coremember2?: true
    coremember3?: true
    facultyEmail?: true
    collegeName?: true
    collegeId?: true
    type?: true
    description?: true
    requirements?: true
    profilePicUrl?: true
    clubContact?: true
    wings?: true
    instagram?: true
    twitter?: true
    linkedin?: true
    _all?: true
  }

  export type ClubsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which clubs to aggregate.
     */
    where?: clubsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of clubs to fetch.
     */
    orderBy?: clubsOrderByWithRelationInput | clubsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: clubsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` clubs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` clubs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned clubs
    **/
    _count?: true | ClubsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClubsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClubsMaxAggregateInputType
  }

  export type GetClubsAggregateType<T extends ClubsAggregateArgs> = {
        [P in keyof T & keyof AggregateClubs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClubs[P]>
      : GetScalarType<T[P], AggregateClubs[P]>
  }




  export type clubsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: clubsWhereInput
    orderBy?: clubsOrderByWithAggregationInput | clubsOrderByWithAggregationInput[]
    by: ClubsScalarFieldEnum[] | ClubsScalarFieldEnum
    having?: clubsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClubsCountAggregateInputType | true
    _min?: ClubsMinAggregateInputType
    _max?: ClubsMaxAggregateInputType
  }

  export type ClubsGroupByOutputType = {
    id: string
    name: string
    founderEmail: string
    coremember1: string | null
    coremember2: string | null
    coremember3: string | null
    facultyEmail: string
    collegeName: string
    collegeId: string
    type: string
    description: string
    requirements: string | null
    profilePicUrl: string | null
    clubContact: string
    wings: string[]
    instagram: string | null
    twitter: string | null
    linkedin: string | null
    _count: ClubsCountAggregateOutputType | null
    _min: ClubsMinAggregateOutputType | null
    _max: ClubsMaxAggregateOutputType | null
  }

  type GetClubsGroupByPayload<T extends clubsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClubsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClubsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClubsGroupByOutputType[P]>
            : GetScalarType<T[P], ClubsGroupByOutputType[P]>
        }
      >
    >


  export type clubsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    founderEmail?: boolean
    coremember1?: boolean
    coremember2?: boolean
    coremember3?: boolean
    facultyEmail?: boolean
    collegeName?: boolean
    collegeId?: boolean
    type?: boolean
    description?: boolean
    requirements?: boolean
    profilePicUrl?: boolean
    clubContact?: boolean
    wings?: boolean
    instagram?: boolean
    twitter?: boolean
    linkedin?: boolean
    posts?: boolean | clubs$postsArgs<ExtArgs>
    members?: boolean | clubs$membersArgs<ExtArgs>
    events?: boolean | clubs$eventsArgs<ExtArgs>
    announcements?: boolean | clubs$announcementsArgs<ExtArgs>
    _count?: boolean | ClubsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubs"]>

  export type clubsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    founderEmail?: boolean
    coremember1?: boolean
    coremember2?: boolean
    coremember3?: boolean
    facultyEmail?: boolean
    collegeName?: boolean
    collegeId?: boolean
    type?: boolean
    description?: boolean
    requirements?: boolean
    profilePicUrl?: boolean
    clubContact?: boolean
    wings?: boolean
    instagram?: boolean
    twitter?: boolean
    linkedin?: boolean
  }, ExtArgs["result"]["clubs"]>

  export type clubsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    founderEmail?: boolean
    coremember1?: boolean
    coremember2?: boolean
    coremember3?: boolean
    facultyEmail?: boolean
    collegeName?: boolean
    collegeId?: boolean
    type?: boolean
    description?: boolean
    requirements?: boolean
    profilePicUrl?: boolean
    clubContact?: boolean
    wings?: boolean
    instagram?: boolean
    twitter?: boolean
    linkedin?: boolean
  }, ExtArgs["result"]["clubs"]>

  export type clubsSelectScalar = {
    id?: boolean
    name?: boolean
    founderEmail?: boolean
    coremember1?: boolean
    coremember2?: boolean
    coremember3?: boolean
    facultyEmail?: boolean
    collegeName?: boolean
    collegeId?: boolean
    type?: boolean
    description?: boolean
    requirements?: boolean
    profilePicUrl?: boolean
    clubContact?: boolean
    wings?: boolean
    instagram?: boolean
    twitter?: boolean
    linkedin?: boolean
  }

  export type clubsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "founderEmail" | "coremember1" | "coremember2" | "coremember3" | "facultyEmail" | "collegeName" | "collegeId" | "type" | "description" | "requirements" | "profilePicUrl" | "clubContact" | "wings" | "instagram" | "twitter" | "linkedin", ExtArgs["result"]["clubs"]>
  export type clubsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | clubs$postsArgs<ExtArgs>
    members?: boolean | clubs$membersArgs<ExtArgs>
    events?: boolean | clubs$eventsArgs<ExtArgs>
    announcements?: boolean | clubs$announcementsArgs<ExtArgs>
    _count?: boolean | ClubsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type clubsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type clubsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $clubsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "clubs"
    objects: {
      posts: Prisma.$CreatePostPayload<ExtArgs>[]
      members: Prisma.$UserPayload<ExtArgs>[]
      events: Prisma.$eventPayload<ExtArgs>[]
      announcements: Prisma.$clubAnnouncementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      founderEmail: string
      coremember1: string | null
      coremember2: string | null
      coremember3: string | null
      facultyEmail: string
      collegeName: string
      collegeId: string
      type: string
      description: string
      requirements: string | null
      profilePicUrl: string | null
      clubContact: string
      wings: string[]
      instagram: string | null
      twitter: string | null
      linkedin: string | null
    }, ExtArgs["result"]["clubs"]>
    composites: {}
  }

  type clubsGetPayload<S extends boolean | null | undefined | clubsDefaultArgs> = $Result.GetResult<Prisma.$clubsPayload, S>

  type clubsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<clubsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClubsCountAggregateInputType | true
    }

  export interface clubsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['clubs'], meta: { name: 'clubs' } }
    /**
     * Find zero or one Clubs that matches the filter.
     * @param {clubsFindUniqueArgs} args - Arguments to find a Clubs
     * @example
     * // Get one Clubs
     * const clubs = await prisma.clubs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends clubsFindUniqueArgs>(args: SelectSubset<T, clubsFindUniqueArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Clubs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {clubsFindUniqueOrThrowArgs} args - Arguments to find a Clubs
     * @example
     * // Get one Clubs
     * const clubs = await prisma.clubs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends clubsFindUniqueOrThrowArgs>(args: SelectSubset<T, clubsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Clubs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubsFindFirstArgs} args - Arguments to find a Clubs
     * @example
     * // Get one Clubs
     * const clubs = await prisma.clubs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends clubsFindFirstArgs>(args?: SelectSubset<T, clubsFindFirstArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Clubs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubsFindFirstOrThrowArgs} args - Arguments to find a Clubs
     * @example
     * // Get one Clubs
     * const clubs = await prisma.clubs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends clubsFindFirstOrThrowArgs>(args?: SelectSubset<T, clubsFindFirstOrThrowArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clubs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clubs
     * const clubs = await prisma.clubs.findMany()
     * 
     * // Get first 10 Clubs
     * const clubs = await prisma.clubs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clubsWithIdOnly = await prisma.clubs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends clubsFindManyArgs>(args?: SelectSubset<T, clubsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Clubs.
     * @param {clubsCreateArgs} args - Arguments to create a Clubs.
     * @example
     * // Create one Clubs
     * const Clubs = await prisma.clubs.create({
     *   data: {
     *     // ... data to create a Clubs
     *   }
     * })
     * 
     */
    create<T extends clubsCreateArgs>(args: SelectSubset<T, clubsCreateArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clubs.
     * @param {clubsCreateManyArgs} args - Arguments to create many Clubs.
     * @example
     * // Create many Clubs
     * const clubs = await prisma.clubs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends clubsCreateManyArgs>(args?: SelectSubset<T, clubsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clubs and returns the data saved in the database.
     * @param {clubsCreateManyAndReturnArgs} args - Arguments to create many Clubs.
     * @example
     * // Create many Clubs
     * const clubs = await prisma.clubs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clubs and only return the `id`
     * const clubsWithIdOnly = await prisma.clubs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends clubsCreateManyAndReturnArgs>(args?: SelectSubset<T, clubsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Clubs.
     * @param {clubsDeleteArgs} args - Arguments to delete one Clubs.
     * @example
     * // Delete one Clubs
     * const Clubs = await prisma.clubs.delete({
     *   where: {
     *     // ... filter to delete one Clubs
     *   }
     * })
     * 
     */
    delete<T extends clubsDeleteArgs>(args: SelectSubset<T, clubsDeleteArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Clubs.
     * @param {clubsUpdateArgs} args - Arguments to update one Clubs.
     * @example
     * // Update one Clubs
     * const clubs = await prisma.clubs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends clubsUpdateArgs>(args: SelectSubset<T, clubsUpdateArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clubs.
     * @param {clubsDeleteManyArgs} args - Arguments to filter Clubs to delete.
     * @example
     * // Delete a few Clubs
     * const { count } = await prisma.clubs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends clubsDeleteManyArgs>(args?: SelectSubset<T, clubsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clubs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clubs
     * const clubs = await prisma.clubs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends clubsUpdateManyArgs>(args: SelectSubset<T, clubsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clubs and returns the data updated in the database.
     * @param {clubsUpdateManyAndReturnArgs} args - Arguments to update many Clubs.
     * @example
     * // Update many Clubs
     * const clubs = await prisma.clubs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clubs and only return the `id`
     * const clubsWithIdOnly = await prisma.clubs.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends clubsUpdateManyAndReturnArgs>(args: SelectSubset<T, clubsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Clubs.
     * @param {clubsUpsertArgs} args - Arguments to update or create a Clubs.
     * @example
     * // Update or create a Clubs
     * const clubs = await prisma.clubs.upsert({
     *   create: {
     *     // ... data to create a Clubs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Clubs we want to update
     *   }
     * })
     */
    upsert<T extends clubsUpsertArgs>(args: SelectSubset<T, clubsUpsertArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clubs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubsCountArgs} args - Arguments to filter Clubs to count.
     * @example
     * // Count the number of Clubs
     * const count = await prisma.clubs.count({
     *   where: {
     *     // ... the filter for the Clubs we want to count
     *   }
     * })
    **/
    count<T extends clubsCountArgs>(
      args?: Subset<T, clubsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClubsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Clubs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClubsAggregateArgs>(args: Subset<T, ClubsAggregateArgs>): Prisma.PrismaPromise<GetClubsAggregateType<T>>

    /**
     * Group by Clubs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends clubsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: clubsGroupByArgs['orderBy'] }
        : { orderBy?: clubsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, clubsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClubsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the clubs model
   */
  readonly fields: clubsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for clubs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__clubsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    posts<T extends clubs$postsArgs<ExtArgs> = {}>(args?: Subset<T, clubs$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    members<T extends clubs$membersArgs<ExtArgs> = {}>(args?: Subset<T, clubs$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends clubs$eventsArgs<ExtArgs> = {}>(args?: Subset<T, clubs$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    announcements<T extends clubs$announcementsArgs<ExtArgs> = {}>(args?: Subset<T, clubs$announcementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the clubs model
   */
  interface clubsFieldRefs {
    readonly id: FieldRef<"clubs", 'String'>
    readonly name: FieldRef<"clubs", 'String'>
    readonly founderEmail: FieldRef<"clubs", 'String'>
    readonly coremember1: FieldRef<"clubs", 'String'>
    readonly coremember2: FieldRef<"clubs", 'String'>
    readonly coremember3: FieldRef<"clubs", 'String'>
    readonly facultyEmail: FieldRef<"clubs", 'String'>
    readonly collegeName: FieldRef<"clubs", 'String'>
    readonly collegeId: FieldRef<"clubs", 'String'>
    readonly type: FieldRef<"clubs", 'String'>
    readonly description: FieldRef<"clubs", 'String'>
    readonly requirements: FieldRef<"clubs", 'String'>
    readonly profilePicUrl: FieldRef<"clubs", 'String'>
    readonly clubContact: FieldRef<"clubs", 'String'>
    readonly wings: FieldRef<"clubs", 'String[]'>
    readonly instagram: FieldRef<"clubs", 'String'>
    readonly twitter: FieldRef<"clubs", 'String'>
    readonly linkedin: FieldRef<"clubs", 'String'>
  }
    

  // Custom InputTypes
  /**
   * clubs findUnique
   */
  export type clubsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * Filter, which clubs to fetch.
     */
    where: clubsWhereUniqueInput
  }

  /**
   * clubs findUniqueOrThrow
   */
  export type clubsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * Filter, which clubs to fetch.
     */
    where: clubsWhereUniqueInput
  }

  /**
   * clubs findFirst
   */
  export type clubsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * Filter, which clubs to fetch.
     */
    where?: clubsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of clubs to fetch.
     */
    orderBy?: clubsOrderByWithRelationInput | clubsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for clubs.
     */
    cursor?: clubsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` clubs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` clubs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of clubs.
     */
    distinct?: ClubsScalarFieldEnum | ClubsScalarFieldEnum[]
  }

  /**
   * clubs findFirstOrThrow
   */
  export type clubsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * Filter, which clubs to fetch.
     */
    where?: clubsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of clubs to fetch.
     */
    orderBy?: clubsOrderByWithRelationInput | clubsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for clubs.
     */
    cursor?: clubsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` clubs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` clubs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of clubs.
     */
    distinct?: ClubsScalarFieldEnum | ClubsScalarFieldEnum[]
  }

  /**
   * clubs findMany
   */
  export type clubsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * Filter, which clubs to fetch.
     */
    where?: clubsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of clubs to fetch.
     */
    orderBy?: clubsOrderByWithRelationInput | clubsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing clubs.
     */
    cursor?: clubsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` clubs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` clubs.
     */
    skip?: number
    distinct?: ClubsScalarFieldEnum | ClubsScalarFieldEnum[]
  }

  /**
   * clubs create
   */
  export type clubsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * The data needed to create a clubs.
     */
    data: XOR<clubsCreateInput, clubsUncheckedCreateInput>
  }

  /**
   * clubs createMany
   */
  export type clubsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many clubs.
     */
    data: clubsCreateManyInput | clubsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * clubs createManyAndReturn
   */
  export type clubsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * The data used to create many clubs.
     */
    data: clubsCreateManyInput | clubsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * clubs update
   */
  export type clubsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * The data needed to update a clubs.
     */
    data: XOR<clubsUpdateInput, clubsUncheckedUpdateInput>
    /**
     * Choose, which clubs to update.
     */
    where: clubsWhereUniqueInput
  }

  /**
   * clubs updateMany
   */
  export type clubsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update clubs.
     */
    data: XOR<clubsUpdateManyMutationInput, clubsUncheckedUpdateManyInput>
    /**
     * Filter which clubs to update
     */
    where?: clubsWhereInput
    /**
     * Limit how many clubs to update.
     */
    limit?: number
  }

  /**
   * clubs updateManyAndReturn
   */
  export type clubsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * The data used to update clubs.
     */
    data: XOR<clubsUpdateManyMutationInput, clubsUncheckedUpdateManyInput>
    /**
     * Filter which clubs to update
     */
    where?: clubsWhereInput
    /**
     * Limit how many clubs to update.
     */
    limit?: number
  }

  /**
   * clubs upsert
   */
  export type clubsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * The filter to search for the clubs to update in case it exists.
     */
    where: clubsWhereUniqueInput
    /**
     * In case the clubs found by the `where` argument doesn't exist, create a new clubs with this data.
     */
    create: XOR<clubsCreateInput, clubsUncheckedCreateInput>
    /**
     * In case the clubs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<clubsUpdateInput, clubsUncheckedUpdateInput>
  }

  /**
   * clubs delete
   */
  export type clubsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    /**
     * Filter which clubs to delete.
     */
    where: clubsWhereUniqueInput
  }

  /**
   * clubs deleteMany
   */
  export type clubsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which clubs to delete
     */
    where?: clubsWhereInput
    /**
     * Limit how many clubs to delete.
     */
    limit?: number
  }

  /**
   * clubs.posts
   */
  export type clubs$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    where?: CreatePostWhereInput
    orderBy?: CreatePostOrderByWithRelationInput | CreatePostOrderByWithRelationInput[]
    cursor?: CreatePostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CreatePostScalarFieldEnum | CreatePostScalarFieldEnum[]
  }

  /**
   * clubs.members
   */
  export type clubs$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * clubs.events
   */
  export type clubs$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    where?: eventWhereInput
    orderBy?: eventOrderByWithRelationInput | eventOrderByWithRelationInput[]
    cursor?: eventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * clubs.announcements
   */
  export type clubs$announcementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    where?: clubAnnouncementWhereInput
    orderBy?: clubAnnouncementOrderByWithRelationInput | clubAnnouncementOrderByWithRelationInput[]
    cursor?: clubAnnouncementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClubAnnouncementScalarFieldEnum | ClubAnnouncementScalarFieldEnum[]
  }

  /**
   * clubs without action
   */
  export type clubsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
  }


  /**
   * Model CreatePost
   */

  export type AggregateCreatePost = {
    _count: CreatePostCountAggregateOutputType | null
    _min: CreatePostMinAggregateOutputType | null
    _max: CreatePostMaxAggregateOutputType | null
  }

  export type CreatePostMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    published: boolean | null
    collegeName: string | null
    clubName: string | null
    collegeId: string | null
    authorId: string | null
  }

  export type CreatePostMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    published: boolean | null
    collegeName: string | null
    clubName: string | null
    collegeId: string | null
    authorId: string | null
  }

  export type CreatePostCountAggregateOutputType = {
    id: number
    title: number
    description: number
    image: number
    createdAt: number
    updatedAt: number
    published: number
    collegeName: number
    clubName: number
    collegeId: number
    authorId: number
    _all: number
  }


  export type CreatePostMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    published?: true
    collegeName?: true
    clubName?: true
    collegeId?: true
    authorId?: true
  }

  export type CreatePostMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    published?: true
    collegeName?: true
    clubName?: true
    collegeId?: true
    authorId?: true
  }

  export type CreatePostCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    published?: true
    collegeName?: true
    clubName?: true
    collegeId?: true
    authorId?: true
    _all?: true
  }

  export type CreatePostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CreatePost to aggregate.
     */
    where?: CreatePostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreatePosts to fetch.
     */
    orderBy?: CreatePostOrderByWithRelationInput | CreatePostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CreatePostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreatePosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreatePosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CreatePosts
    **/
    _count?: true | CreatePostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CreatePostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CreatePostMaxAggregateInputType
  }

  export type GetCreatePostAggregateType<T extends CreatePostAggregateArgs> = {
        [P in keyof T & keyof AggregateCreatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCreatePost[P]>
      : GetScalarType<T[P], AggregateCreatePost[P]>
  }




  export type CreatePostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CreatePostWhereInput
    orderBy?: CreatePostOrderByWithAggregationInput | CreatePostOrderByWithAggregationInput[]
    by: CreatePostScalarFieldEnum[] | CreatePostScalarFieldEnum
    having?: CreatePostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CreatePostCountAggregateInputType | true
    _min?: CreatePostMinAggregateInputType
    _max?: CreatePostMaxAggregateInputType
  }

  export type CreatePostGroupByOutputType = {
    id: string
    title: string
    description: string
    image: string | null
    createdAt: Date
    updatedAt: Date
    published: boolean
    collegeName: string
    clubName: string
    collegeId: string | null
    authorId: string
    _count: CreatePostCountAggregateOutputType | null
    _min: CreatePostMinAggregateOutputType | null
    _max: CreatePostMaxAggregateOutputType | null
  }

  type GetCreatePostGroupByPayload<T extends CreatePostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CreatePostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CreatePostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CreatePostGroupByOutputType[P]>
            : GetScalarType<T[P], CreatePostGroupByOutputType[P]>
        }
      >
    >


  export type CreatePostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    published?: boolean
    collegeName?: boolean
    clubName?: boolean
    collegeId?: boolean
    authorId?: boolean
    club?: boolean | CreatePost$clubArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    upvotes?: boolean | CreatePost$upvotesArgs<ExtArgs>
    downvotes?: boolean | CreatePost$downvotesArgs<ExtArgs>
    _count?: boolean | CreatePostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["createPost"]>

  export type CreatePostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    published?: boolean
    collegeName?: boolean
    clubName?: boolean
    collegeId?: boolean
    authorId?: boolean
    club?: boolean | CreatePost$clubArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["createPost"]>

  export type CreatePostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    published?: boolean
    collegeName?: boolean
    clubName?: boolean
    collegeId?: boolean
    authorId?: boolean
    club?: boolean | CreatePost$clubArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["createPost"]>

  export type CreatePostSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    published?: boolean
    collegeName?: boolean
    clubName?: boolean
    collegeId?: boolean
    authorId?: boolean
  }

  export type CreatePostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "image" | "createdAt" | "updatedAt" | "published" | "collegeName" | "clubName" | "collegeId" | "authorId", ExtArgs["result"]["createPost"]>
  export type CreatePostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | CreatePost$clubArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    upvotes?: boolean | CreatePost$upvotesArgs<ExtArgs>
    downvotes?: boolean | CreatePost$downvotesArgs<ExtArgs>
    _count?: boolean | CreatePostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CreatePostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | CreatePost$clubArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CreatePostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | CreatePost$clubArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CreatePostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CreatePost"
    objects: {
      club: Prisma.$clubsPayload<ExtArgs> | null
      author: Prisma.$UserPayload<ExtArgs>
      upvotes: Prisma.$PostUpvotePayload<ExtArgs>[]
      downvotes: Prisma.$PostDownvotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      image: string | null
      createdAt: Date
      updatedAt: Date
      published: boolean
      collegeName: string
      clubName: string
      collegeId: string | null
      authorId: string
    }, ExtArgs["result"]["createPost"]>
    composites: {}
  }

  type CreatePostGetPayload<S extends boolean | null | undefined | CreatePostDefaultArgs> = $Result.GetResult<Prisma.$CreatePostPayload, S>

  type CreatePostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CreatePostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CreatePostCountAggregateInputType | true
    }

  export interface CreatePostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CreatePost'], meta: { name: 'CreatePost' } }
    /**
     * Find zero or one CreatePost that matches the filter.
     * @param {CreatePostFindUniqueArgs} args - Arguments to find a CreatePost
     * @example
     * // Get one CreatePost
     * const createPost = await prisma.createPost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CreatePostFindUniqueArgs>(args: SelectSubset<T, CreatePostFindUniqueArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CreatePost that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CreatePostFindUniqueOrThrowArgs} args - Arguments to find a CreatePost
     * @example
     * // Get one CreatePost
     * const createPost = await prisma.createPost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CreatePostFindUniqueOrThrowArgs>(args: SelectSubset<T, CreatePostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CreatePost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreatePostFindFirstArgs} args - Arguments to find a CreatePost
     * @example
     * // Get one CreatePost
     * const createPost = await prisma.createPost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CreatePostFindFirstArgs>(args?: SelectSubset<T, CreatePostFindFirstArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CreatePost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreatePostFindFirstOrThrowArgs} args - Arguments to find a CreatePost
     * @example
     * // Get one CreatePost
     * const createPost = await prisma.createPost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CreatePostFindFirstOrThrowArgs>(args?: SelectSubset<T, CreatePostFindFirstOrThrowArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CreatePosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreatePostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CreatePosts
     * const createPosts = await prisma.createPost.findMany()
     * 
     * // Get first 10 CreatePosts
     * const createPosts = await prisma.createPost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const createPostWithIdOnly = await prisma.createPost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CreatePostFindManyArgs>(args?: SelectSubset<T, CreatePostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CreatePost.
     * @param {CreatePostCreateArgs} args - Arguments to create a CreatePost.
     * @example
     * // Create one CreatePost
     * const CreatePost = await prisma.createPost.create({
     *   data: {
     *     // ... data to create a CreatePost
     *   }
     * })
     * 
     */
    create<T extends CreatePostCreateArgs>(args: SelectSubset<T, CreatePostCreateArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CreatePosts.
     * @param {CreatePostCreateManyArgs} args - Arguments to create many CreatePosts.
     * @example
     * // Create many CreatePosts
     * const createPost = await prisma.createPost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CreatePostCreateManyArgs>(args?: SelectSubset<T, CreatePostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CreatePosts and returns the data saved in the database.
     * @param {CreatePostCreateManyAndReturnArgs} args - Arguments to create many CreatePosts.
     * @example
     * // Create many CreatePosts
     * const createPost = await prisma.createPost.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CreatePosts and only return the `id`
     * const createPostWithIdOnly = await prisma.createPost.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CreatePostCreateManyAndReturnArgs>(args?: SelectSubset<T, CreatePostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CreatePost.
     * @param {CreatePostDeleteArgs} args - Arguments to delete one CreatePost.
     * @example
     * // Delete one CreatePost
     * const CreatePost = await prisma.createPost.delete({
     *   where: {
     *     // ... filter to delete one CreatePost
     *   }
     * })
     * 
     */
    delete<T extends CreatePostDeleteArgs>(args: SelectSubset<T, CreatePostDeleteArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CreatePost.
     * @param {CreatePostUpdateArgs} args - Arguments to update one CreatePost.
     * @example
     * // Update one CreatePost
     * const createPost = await prisma.createPost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CreatePostUpdateArgs>(args: SelectSubset<T, CreatePostUpdateArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CreatePosts.
     * @param {CreatePostDeleteManyArgs} args - Arguments to filter CreatePosts to delete.
     * @example
     * // Delete a few CreatePosts
     * const { count } = await prisma.createPost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CreatePostDeleteManyArgs>(args?: SelectSubset<T, CreatePostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CreatePosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreatePostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CreatePosts
     * const createPost = await prisma.createPost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CreatePostUpdateManyArgs>(args: SelectSubset<T, CreatePostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CreatePosts and returns the data updated in the database.
     * @param {CreatePostUpdateManyAndReturnArgs} args - Arguments to update many CreatePosts.
     * @example
     * // Update many CreatePosts
     * const createPost = await prisma.createPost.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CreatePosts and only return the `id`
     * const createPostWithIdOnly = await prisma.createPost.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CreatePostUpdateManyAndReturnArgs>(args: SelectSubset<T, CreatePostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CreatePost.
     * @param {CreatePostUpsertArgs} args - Arguments to update or create a CreatePost.
     * @example
     * // Update or create a CreatePost
     * const createPost = await prisma.createPost.upsert({
     *   create: {
     *     // ... data to create a CreatePost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CreatePost we want to update
     *   }
     * })
     */
    upsert<T extends CreatePostUpsertArgs>(args: SelectSubset<T, CreatePostUpsertArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CreatePosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreatePostCountArgs} args - Arguments to filter CreatePosts to count.
     * @example
     * // Count the number of CreatePosts
     * const count = await prisma.createPost.count({
     *   where: {
     *     // ... the filter for the CreatePosts we want to count
     *   }
     * })
    **/
    count<T extends CreatePostCountArgs>(
      args?: Subset<T, CreatePostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CreatePostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CreatePost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreatePostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CreatePostAggregateArgs>(args: Subset<T, CreatePostAggregateArgs>): Prisma.PrismaPromise<GetCreatePostAggregateType<T>>

    /**
     * Group by CreatePost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreatePostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CreatePostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CreatePostGroupByArgs['orderBy'] }
        : { orderBy?: CreatePostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CreatePostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCreatePostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CreatePost model
   */
  readonly fields: CreatePostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CreatePost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CreatePostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    club<T extends CreatePost$clubArgs<ExtArgs> = {}>(args?: Subset<T, CreatePost$clubArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    upvotes<T extends CreatePost$upvotesArgs<ExtArgs> = {}>(args?: Subset<T, CreatePost$upvotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    downvotes<T extends CreatePost$downvotesArgs<ExtArgs> = {}>(args?: Subset<T, CreatePost$downvotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CreatePost model
   */
  interface CreatePostFieldRefs {
    readonly id: FieldRef<"CreatePost", 'String'>
    readonly title: FieldRef<"CreatePost", 'String'>
    readonly description: FieldRef<"CreatePost", 'String'>
    readonly image: FieldRef<"CreatePost", 'String'>
    readonly createdAt: FieldRef<"CreatePost", 'DateTime'>
    readonly updatedAt: FieldRef<"CreatePost", 'DateTime'>
    readonly published: FieldRef<"CreatePost", 'Boolean'>
    readonly collegeName: FieldRef<"CreatePost", 'String'>
    readonly clubName: FieldRef<"CreatePost", 'String'>
    readonly collegeId: FieldRef<"CreatePost", 'String'>
    readonly authorId: FieldRef<"CreatePost", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CreatePost findUnique
   */
  export type CreatePostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * Filter, which CreatePost to fetch.
     */
    where: CreatePostWhereUniqueInput
  }

  /**
   * CreatePost findUniqueOrThrow
   */
  export type CreatePostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * Filter, which CreatePost to fetch.
     */
    where: CreatePostWhereUniqueInput
  }

  /**
   * CreatePost findFirst
   */
  export type CreatePostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * Filter, which CreatePost to fetch.
     */
    where?: CreatePostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreatePosts to fetch.
     */
    orderBy?: CreatePostOrderByWithRelationInput | CreatePostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CreatePosts.
     */
    cursor?: CreatePostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreatePosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreatePosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CreatePosts.
     */
    distinct?: CreatePostScalarFieldEnum | CreatePostScalarFieldEnum[]
  }

  /**
   * CreatePost findFirstOrThrow
   */
  export type CreatePostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * Filter, which CreatePost to fetch.
     */
    where?: CreatePostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreatePosts to fetch.
     */
    orderBy?: CreatePostOrderByWithRelationInput | CreatePostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CreatePosts.
     */
    cursor?: CreatePostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreatePosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreatePosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CreatePosts.
     */
    distinct?: CreatePostScalarFieldEnum | CreatePostScalarFieldEnum[]
  }

  /**
   * CreatePost findMany
   */
  export type CreatePostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * Filter, which CreatePosts to fetch.
     */
    where?: CreatePostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreatePosts to fetch.
     */
    orderBy?: CreatePostOrderByWithRelationInput | CreatePostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CreatePosts.
     */
    cursor?: CreatePostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreatePosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreatePosts.
     */
    skip?: number
    distinct?: CreatePostScalarFieldEnum | CreatePostScalarFieldEnum[]
  }

  /**
   * CreatePost create
   */
  export type CreatePostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * The data needed to create a CreatePost.
     */
    data: XOR<CreatePostCreateInput, CreatePostUncheckedCreateInput>
  }

  /**
   * CreatePost createMany
   */
  export type CreatePostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CreatePosts.
     */
    data: CreatePostCreateManyInput | CreatePostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CreatePost createManyAndReturn
   */
  export type CreatePostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * The data used to create many CreatePosts.
     */
    data: CreatePostCreateManyInput | CreatePostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CreatePost update
   */
  export type CreatePostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * The data needed to update a CreatePost.
     */
    data: XOR<CreatePostUpdateInput, CreatePostUncheckedUpdateInput>
    /**
     * Choose, which CreatePost to update.
     */
    where: CreatePostWhereUniqueInput
  }

  /**
   * CreatePost updateMany
   */
  export type CreatePostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CreatePosts.
     */
    data: XOR<CreatePostUpdateManyMutationInput, CreatePostUncheckedUpdateManyInput>
    /**
     * Filter which CreatePosts to update
     */
    where?: CreatePostWhereInput
    /**
     * Limit how many CreatePosts to update.
     */
    limit?: number
  }

  /**
   * CreatePost updateManyAndReturn
   */
  export type CreatePostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * The data used to update CreatePosts.
     */
    data: XOR<CreatePostUpdateManyMutationInput, CreatePostUncheckedUpdateManyInput>
    /**
     * Filter which CreatePosts to update
     */
    where?: CreatePostWhereInput
    /**
     * Limit how many CreatePosts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CreatePost upsert
   */
  export type CreatePostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * The filter to search for the CreatePost to update in case it exists.
     */
    where: CreatePostWhereUniqueInput
    /**
     * In case the CreatePost found by the `where` argument doesn't exist, create a new CreatePost with this data.
     */
    create: XOR<CreatePostCreateInput, CreatePostUncheckedCreateInput>
    /**
     * In case the CreatePost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CreatePostUpdateInput, CreatePostUncheckedUpdateInput>
  }

  /**
   * CreatePost delete
   */
  export type CreatePostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
    /**
     * Filter which CreatePost to delete.
     */
    where: CreatePostWhereUniqueInput
  }

  /**
   * CreatePost deleteMany
   */
  export type CreatePostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CreatePosts to delete
     */
    where?: CreatePostWhereInput
    /**
     * Limit how many CreatePosts to delete.
     */
    limit?: number
  }

  /**
   * CreatePost.club
   */
  export type CreatePost$clubArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubs
     */
    select?: clubsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubs
     */
    omit?: clubsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubsInclude<ExtArgs> | null
    where?: clubsWhereInput
  }

  /**
   * CreatePost.upvotes
   */
  export type CreatePost$upvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    where?: PostUpvoteWhereInput
    orderBy?: PostUpvoteOrderByWithRelationInput | PostUpvoteOrderByWithRelationInput[]
    cursor?: PostUpvoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostUpvoteScalarFieldEnum | PostUpvoteScalarFieldEnum[]
  }

  /**
   * CreatePost.downvotes
   */
  export type CreatePost$downvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    where?: PostDownvoteWhereInput
    orderBy?: PostDownvoteOrderByWithRelationInput | PostDownvoteOrderByWithRelationInput[]
    cursor?: PostDownvoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostDownvoteScalarFieldEnum | PostDownvoteScalarFieldEnum[]
  }

  /**
   * CreatePost without action
   */
  export type CreatePostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreatePost
     */
    select?: CreatePostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreatePost
     */
    omit?: CreatePostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CreatePostInclude<ExtArgs> | null
  }


  /**
   * Model speakers
   */

  export type AggregateSpeakers = {
    _count: SpeakersCountAggregateOutputType | null
    _avg: SpeakersAvgAggregateOutputType | null
    _sum: SpeakersSumAggregateOutputType | null
    _min: SpeakersMinAggregateOutputType | null
    _max: SpeakersMaxAggregateOutputType | null
  }

  export type SpeakersAvgAggregateOutputType = {
    id: number | null
  }

  export type SpeakersSumAggregateOutputType = {
    id: number | null
  }

  export type SpeakersMinAggregateOutputType = {
    id: number | null
    profilePic: string | null
    about: string | null
    name: string | null
    email: string | null
    eventId: string | null
  }

  export type SpeakersMaxAggregateOutputType = {
    id: number | null
    profilePic: string | null
    about: string | null
    name: string | null
    email: string | null
    eventId: string | null
  }

  export type SpeakersCountAggregateOutputType = {
    id: number
    profilePic: number
    about: number
    name: number
    email: number
    eventId: number
    _all: number
  }


  export type SpeakersAvgAggregateInputType = {
    id?: true
  }

  export type SpeakersSumAggregateInputType = {
    id?: true
  }

  export type SpeakersMinAggregateInputType = {
    id?: true
    profilePic?: true
    about?: true
    name?: true
    email?: true
    eventId?: true
  }

  export type SpeakersMaxAggregateInputType = {
    id?: true
    profilePic?: true
    about?: true
    name?: true
    email?: true
    eventId?: true
  }

  export type SpeakersCountAggregateInputType = {
    id?: true
    profilePic?: true
    about?: true
    name?: true
    email?: true
    eventId?: true
    _all?: true
  }

  export type SpeakersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which speakers to aggregate.
     */
    where?: speakersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of speakers to fetch.
     */
    orderBy?: speakersOrderByWithRelationInput | speakersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: speakersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` speakers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` speakers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned speakers
    **/
    _count?: true | SpeakersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpeakersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpeakersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpeakersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpeakersMaxAggregateInputType
  }

  export type GetSpeakersAggregateType<T extends SpeakersAggregateArgs> = {
        [P in keyof T & keyof AggregateSpeakers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpeakers[P]>
      : GetScalarType<T[P], AggregateSpeakers[P]>
  }




  export type speakersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: speakersWhereInput
    orderBy?: speakersOrderByWithAggregationInput | speakersOrderByWithAggregationInput[]
    by: SpeakersScalarFieldEnum[] | SpeakersScalarFieldEnum
    having?: speakersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpeakersCountAggregateInputType | true
    _avg?: SpeakersAvgAggregateInputType
    _sum?: SpeakersSumAggregateInputType
    _min?: SpeakersMinAggregateInputType
    _max?: SpeakersMaxAggregateInputType
  }

  export type SpeakersGroupByOutputType = {
    id: number
    profilePic: string | null
    about: string
    name: string
    email: string
    eventId: string
    _count: SpeakersCountAggregateOutputType | null
    _avg: SpeakersAvgAggregateOutputType | null
    _sum: SpeakersSumAggregateOutputType | null
    _min: SpeakersMinAggregateOutputType | null
    _max: SpeakersMaxAggregateOutputType | null
  }

  type GetSpeakersGroupByPayload<T extends speakersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpeakersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpeakersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpeakersGroupByOutputType[P]>
            : GetScalarType<T[P], SpeakersGroupByOutputType[P]>
        }
      >
    >


  export type speakersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profilePic?: boolean
    about?: boolean
    name?: boolean
    email?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["speakers"]>

  export type speakersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profilePic?: boolean
    about?: boolean
    name?: boolean
    email?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["speakers"]>

  export type speakersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profilePic?: boolean
    about?: boolean
    name?: boolean
    email?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["speakers"]>

  export type speakersSelectScalar = {
    id?: boolean
    profilePic?: boolean
    about?: boolean
    name?: boolean
    email?: boolean
    eventId?: boolean
  }

  export type speakersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profilePic" | "about" | "name" | "email" | "eventId", ExtArgs["result"]["speakers"]>
  export type speakersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }
  export type speakersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }
  export type speakersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }

  export type $speakersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "speakers"
    objects: {
      event: Prisma.$eventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      profilePic: string | null
      about: string
      name: string
      email: string
      eventId: string
    }, ExtArgs["result"]["speakers"]>
    composites: {}
  }

  type speakersGetPayload<S extends boolean | null | undefined | speakersDefaultArgs> = $Result.GetResult<Prisma.$speakersPayload, S>

  type speakersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<speakersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpeakersCountAggregateInputType | true
    }

  export interface speakersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['speakers'], meta: { name: 'speakers' } }
    /**
     * Find zero or one Speakers that matches the filter.
     * @param {speakersFindUniqueArgs} args - Arguments to find a Speakers
     * @example
     * // Get one Speakers
     * const speakers = await prisma.speakers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends speakersFindUniqueArgs>(args: SelectSubset<T, speakersFindUniqueArgs<ExtArgs>>): Prisma__speakersClient<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Speakers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {speakersFindUniqueOrThrowArgs} args - Arguments to find a Speakers
     * @example
     * // Get one Speakers
     * const speakers = await prisma.speakers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends speakersFindUniqueOrThrowArgs>(args: SelectSubset<T, speakersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__speakersClient<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Speakers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {speakersFindFirstArgs} args - Arguments to find a Speakers
     * @example
     * // Get one Speakers
     * const speakers = await prisma.speakers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends speakersFindFirstArgs>(args?: SelectSubset<T, speakersFindFirstArgs<ExtArgs>>): Prisma__speakersClient<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Speakers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {speakersFindFirstOrThrowArgs} args - Arguments to find a Speakers
     * @example
     * // Get one Speakers
     * const speakers = await prisma.speakers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends speakersFindFirstOrThrowArgs>(args?: SelectSubset<T, speakersFindFirstOrThrowArgs<ExtArgs>>): Prisma__speakersClient<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Speakers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {speakersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Speakers
     * const speakers = await prisma.speakers.findMany()
     * 
     * // Get first 10 Speakers
     * const speakers = await prisma.speakers.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const speakersWithIdOnly = await prisma.speakers.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends speakersFindManyArgs>(args?: SelectSubset<T, speakersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Speakers.
     * @param {speakersCreateArgs} args - Arguments to create a Speakers.
     * @example
     * // Create one Speakers
     * const Speakers = await prisma.speakers.create({
     *   data: {
     *     // ... data to create a Speakers
     *   }
     * })
     * 
     */
    create<T extends speakersCreateArgs>(args: SelectSubset<T, speakersCreateArgs<ExtArgs>>): Prisma__speakersClient<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Speakers.
     * @param {speakersCreateManyArgs} args - Arguments to create many Speakers.
     * @example
     * // Create many Speakers
     * const speakers = await prisma.speakers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends speakersCreateManyArgs>(args?: SelectSubset<T, speakersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Speakers and returns the data saved in the database.
     * @param {speakersCreateManyAndReturnArgs} args - Arguments to create many Speakers.
     * @example
     * // Create many Speakers
     * const speakers = await prisma.speakers.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Speakers and only return the `id`
     * const speakersWithIdOnly = await prisma.speakers.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends speakersCreateManyAndReturnArgs>(args?: SelectSubset<T, speakersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Speakers.
     * @param {speakersDeleteArgs} args - Arguments to delete one Speakers.
     * @example
     * // Delete one Speakers
     * const Speakers = await prisma.speakers.delete({
     *   where: {
     *     // ... filter to delete one Speakers
     *   }
     * })
     * 
     */
    delete<T extends speakersDeleteArgs>(args: SelectSubset<T, speakersDeleteArgs<ExtArgs>>): Prisma__speakersClient<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Speakers.
     * @param {speakersUpdateArgs} args - Arguments to update one Speakers.
     * @example
     * // Update one Speakers
     * const speakers = await prisma.speakers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends speakersUpdateArgs>(args: SelectSubset<T, speakersUpdateArgs<ExtArgs>>): Prisma__speakersClient<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Speakers.
     * @param {speakersDeleteManyArgs} args - Arguments to filter Speakers to delete.
     * @example
     * // Delete a few Speakers
     * const { count } = await prisma.speakers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends speakersDeleteManyArgs>(args?: SelectSubset<T, speakersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Speakers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {speakersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Speakers
     * const speakers = await prisma.speakers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends speakersUpdateManyArgs>(args: SelectSubset<T, speakersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Speakers and returns the data updated in the database.
     * @param {speakersUpdateManyAndReturnArgs} args - Arguments to update many Speakers.
     * @example
     * // Update many Speakers
     * const speakers = await prisma.speakers.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Speakers and only return the `id`
     * const speakersWithIdOnly = await prisma.speakers.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends speakersUpdateManyAndReturnArgs>(args: SelectSubset<T, speakersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Speakers.
     * @param {speakersUpsertArgs} args - Arguments to update or create a Speakers.
     * @example
     * // Update or create a Speakers
     * const speakers = await prisma.speakers.upsert({
     *   create: {
     *     // ... data to create a Speakers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Speakers we want to update
     *   }
     * })
     */
    upsert<T extends speakersUpsertArgs>(args: SelectSubset<T, speakersUpsertArgs<ExtArgs>>): Prisma__speakersClient<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Speakers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {speakersCountArgs} args - Arguments to filter Speakers to count.
     * @example
     * // Count the number of Speakers
     * const count = await prisma.speakers.count({
     *   where: {
     *     // ... the filter for the Speakers we want to count
     *   }
     * })
    **/
    count<T extends speakersCountArgs>(
      args?: Subset<T, speakersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpeakersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Speakers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpeakersAggregateArgs>(args: Subset<T, SpeakersAggregateArgs>): Prisma.PrismaPromise<GetSpeakersAggregateType<T>>

    /**
     * Group by Speakers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {speakersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends speakersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: speakersGroupByArgs['orderBy'] }
        : { orderBy?: speakersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, speakersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpeakersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the speakers model
   */
  readonly fields: speakersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for speakers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__speakersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends eventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, eventDefaultArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the speakers model
   */
  interface speakersFieldRefs {
    readonly id: FieldRef<"speakers", 'Int'>
    readonly profilePic: FieldRef<"speakers", 'String'>
    readonly about: FieldRef<"speakers", 'String'>
    readonly name: FieldRef<"speakers", 'String'>
    readonly email: FieldRef<"speakers", 'String'>
    readonly eventId: FieldRef<"speakers", 'String'>
  }
    

  // Custom InputTypes
  /**
   * speakers findUnique
   */
  export type speakersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * Filter, which speakers to fetch.
     */
    where: speakersWhereUniqueInput
  }

  /**
   * speakers findUniqueOrThrow
   */
  export type speakersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * Filter, which speakers to fetch.
     */
    where: speakersWhereUniqueInput
  }

  /**
   * speakers findFirst
   */
  export type speakersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * Filter, which speakers to fetch.
     */
    where?: speakersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of speakers to fetch.
     */
    orderBy?: speakersOrderByWithRelationInput | speakersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for speakers.
     */
    cursor?: speakersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` speakers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` speakers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of speakers.
     */
    distinct?: SpeakersScalarFieldEnum | SpeakersScalarFieldEnum[]
  }

  /**
   * speakers findFirstOrThrow
   */
  export type speakersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * Filter, which speakers to fetch.
     */
    where?: speakersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of speakers to fetch.
     */
    orderBy?: speakersOrderByWithRelationInput | speakersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for speakers.
     */
    cursor?: speakersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` speakers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` speakers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of speakers.
     */
    distinct?: SpeakersScalarFieldEnum | SpeakersScalarFieldEnum[]
  }

  /**
   * speakers findMany
   */
  export type speakersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * Filter, which speakers to fetch.
     */
    where?: speakersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of speakers to fetch.
     */
    orderBy?: speakersOrderByWithRelationInput | speakersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing speakers.
     */
    cursor?: speakersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` speakers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` speakers.
     */
    skip?: number
    distinct?: SpeakersScalarFieldEnum | SpeakersScalarFieldEnum[]
  }

  /**
   * speakers create
   */
  export type speakersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * The data needed to create a speakers.
     */
    data: XOR<speakersCreateInput, speakersUncheckedCreateInput>
  }

  /**
   * speakers createMany
   */
  export type speakersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many speakers.
     */
    data: speakersCreateManyInput | speakersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * speakers createManyAndReturn
   */
  export type speakersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * The data used to create many speakers.
     */
    data: speakersCreateManyInput | speakersCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * speakers update
   */
  export type speakersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * The data needed to update a speakers.
     */
    data: XOR<speakersUpdateInput, speakersUncheckedUpdateInput>
    /**
     * Choose, which speakers to update.
     */
    where: speakersWhereUniqueInput
  }

  /**
   * speakers updateMany
   */
  export type speakersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update speakers.
     */
    data: XOR<speakersUpdateManyMutationInput, speakersUncheckedUpdateManyInput>
    /**
     * Filter which speakers to update
     */
    where?: speakersWhereInput
    /**
     * Limit how many speakers to update.
     */
    limit?: number
  }

  /**
   * speakers updateManyAndReturn
   */
  export type speakersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * The data used to update speakers.
     */
    data: XOR<speakersUpdateManyMutationInput, speakersUncheckedUpdateManyInput>
    /**
     * Filter which speakers to update
     */
    where?: speakersWhereInput
    /**
     * Limit how many speakers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * speakers upsert
   */
  export type speakersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * The filter to search for the speakers to update in case it exists.
     */
    where: speakersWhereUniqueInput
    /**
     * In case the speakers found by the `where` argument doesn't exist, create a new speakers with this data.
     */
    create: XOR<speakersCreateInput, speakersUncheckedCreateInput>
    /**
     * In case the speakers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<speakersUpdateInput, speakersUncheckedUpdateInput>
  }

  /**
   * speakers delete
   */
  export type speakersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    /**
     * Filter which speakers to delete.
     */
    where: speakersWhereUniqueInput
  }

  /**
   * speakers deleteMany
   */
  export type speakersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which speakers to delete
     */
    where?: speakersWhereInput
    /**
     * Limit how many speakers to delete.
     */
    limit?: number
  }

  /**
   * speakers without action
   */
  export type speakersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
  }


  /**
   * Model event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    TeamSize: number | null
  }

  export type EventSumAggregateOutputType = {
    TeamSize: number | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    posterUrl: string | null
    EventMode: string | null
    EventType: string | null
    eventHeaderImage: string | null
    EventName: string | null
    description: string | null
    tagline: string | null
    prizes: string | null
    TeamSize: number | null
    Venue: string | null
    EventUrl: string | null
    applicationStatus: string | null
    applicationStartDate: string | null
    applicationEndDate: string | null
    clubName: string | null
    clubId: string | null
    university: string | null
    createdAt: Date | null
    startDate: string | null
    endDate: string | null
    collegeStudentsOnly: boolean | null
    participationFee: boolean | null
    contactEmail: string | null
    contactPhone: string | null
    Form: string | null
    Fees: string | null
    link1: string | null
    link2: string | null
    link3: string | null
    whatsappLink: string | null
    isPaid: boolean | null
    qrCodeUrl: string | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    posterUrl: string | null
    EventMode: string | null
    EventType: string | null
    eventHeaderImage: string | null
    EventName: string | null
    description: string | null
    tagline: string | null
    prizes: string | null
    TeamSize: number | null
    Venue: string | null
    EventUrl: string | null
    applicationStatus: string | null
    applicationStartDate: string | null
    applicationEndDate: string | null
    clubName: string | null
    clubId: string | null
    university: string | null
    createdAt: Date | null
    startDate: string | null
    endDate: string | null
    collegeStudentsOnly: boolean | null
    participationFee: boolean | null
    contactEmail: string | null
    contactPhone: string | null
    Form: string | null
    Fees: string | null
    link1: string | null
    link2: string | null
    link3: string | null
    whatsappLink: string | null
    isPaid: boolean | null
    qrCodeUrl: string | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    posterUrl: number
    EventMode: number
    EventType: number
    eventHeaderImage: number
    EventName: number
    description: number
    tagline: number
    prizes: number
    TeamSize: number
    Venue: number
    EventUrl: number
    applicationStatus: number
    applicationStartDate: number
    applicationEndDate: number
    clubName: number
    clubId: number
    university: number
    createdAt: number
    startDate: number
    endDate: number
    collegeStudentsOnly: number
    participationFee: number
    contactEmail: number
    contactPhone: number
    Form: number
    Fees: number
    link1: number
    link2: number
    link3: number
    whatsappLink: number
    isPaid: number
    qrCodeUrl: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    TeamSize?: true
  }

  export type EventSumAggregateInputType = {
    TeamSize?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    posterUrl?: true
    EventMode?: true
    EventType?: true
    eventHeaderImage?: true
    EventName?: true
    description?: true
    tagline?: true
    prizes?: true
    TeamSize?: true
    Venue?: true
    EventUrl?: true
    applicationStatus?: true
    applicationStartDate?: true
    applicationEndDate?: true
    clubName?: true
    clubId?: true
    university?: true
    createdAt?: true
    startDate?: true
    endDate?: true
    collegeStudentsOnly?: true
    participationFee?: true
    contactEmail?: true
    contactPhone?: true
    Form?: true
    Fees?: true
    link1?: true
    link2?: true
    link3?: true
    whatsappLink?: true
    isPaid?: true
    qrCodeUrl?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    posterUrl?: true
    EventMode?: true
    EventType?: true
    eventHeaderImage?: true
    EventName?: true
    description?: true
    tagline?: true
    prizes?: true
    TeamSize?: true
    Venue?: true
    EventUrl?: true
    applicationStatus?: true
    applicationStartDate?: true
    applicationEndDate?: true
    clubName?: true
    clubId?: true
    university?: true
    createdAt?: true
    startDate?: true
    endDate?: true
    collegeStudentsOnly?: true
    participationFee?: true
    contactEmail?: true
    contactPhone?: true
    Form?: true
    Fees?: true
    link1?: true
    link2?: true
    link3?: true
    whatsappLink?: true
    isPaid?: true
    qrCodeUrl?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    posterUrl?: true
    EventMode?: true
    EventType?: true
    eventHeaderImage?: true
    EventName?: true
    description?: true
    tagline?: true
    prizes?: true
    TeamSize?: true
    Venue?: true
    EventUrl?: true
    applicationStatus?: true
    applicationStartDate?: true
    applicationEndDate?: true
    clubName?: true
    clubId?: true
    university?: true
    createdAt?: true
    startDate?: true
    endDate?: true
    collegeStudentsOnly?: true
    participationFee?: true
    contactEmail?: true
    contactPhone?: true
    Form?: true
    Fees?: true
    link1?: true
    link2?: true
    link3?: true
    whatsappLink?: true
    isPaid?: true
    qrCodeUrl?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which event to aggregate.
     */
    where?: eventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of events to fetch.
     */
    orderBy?: eventOrderByWithRelationInput | eventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: eventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type eventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: eventWhereInput
    orderBy?: eventOrderByWithAggregationInput | eventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: eventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    posterUrl: string | null
    EventMode: string
    EventType: string
    eventHeaderImage: string | null
    EventName: string
    description: string
    tagline: string | null
    prizes: string
    TeamSize: number
    Venue: string
    EventUrl: string | null
    applicationStatus: string
    applicationStartDate: string | null
    applicationEndDate: string | null
    clubName: string
    clubId: string
    university: string
    createdAt: Date
    startDate: string
    endDate: string | null
    collegeStudentsOnly: boolean
    participationFee: boolean
    contactEmail: string
    contactPhone: string | null
    Form: string | null
    Fees: string | null
    link1: string | null
    link2: string | null
    link3: string | null
    whatsappLink: string | null
    isPaid: boolean
    qrCodeUrl: string | null
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends eventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type eventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    posterUrl?: boolean
    EventMode?: boolean
    EventType?: boolean
    eventHeaderImage?: boolean
    EventName?: boolean
    description?: boolean
    tagline?: boolean
    prizes?: boolean
    TeamSize?: boolean
    Venue?: boolean
    EventUrl?: boolean
    applicationStatus?: boolean
    applicationStartDate?: boolean
    applicationEndDate?: boolean
    clubName?: boolean
    clubId?: boolean
    university?: boolean
    createdAt?: boolean
    startDate?: boolean
    endDate?: boolean
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    Form?: boolean
    Fees?: boolean
    link1?: boolean
    link2?: boolean
    link3?: boolean
    whatsappLink?: boolean
    isPaid?: boolean
    qrCodeUrl?: boolean
    club?: boolean | clubsDefaultArgs<ExtArgs>
    speakers?: boolean | event$speakersArgs<ExtArgs>
    attendees?: boolean | event$attendeesArgs<ExtArgs>
    announcements?: boolean | event$announcementsArgs<ExtArgs>
    galleries?: boolean | event$galleriesArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type eventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    posterUrl?: boolean
    EventMode?: boolean
    EventType?: boolean
    eventHeaderImage?: boolean
    EventName?: boolean
    description?: boolean
    tagline?: boolean
    prizes?: boolean
    TeamSize?: boolean
    Venue?: boolean
    EventUrl?: boolean
    applicationStatus?: boolean
    applicationStartDate?: boolean
    applicationEndDate?: boolean
    clubName?: boolean
    clubId?: boolean
    university?: boolean
    createdAt?: boolean
    startDate?: boolean
    endDate?: boolean
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    Form?: boolean
    Fees?: boolean
    link1?: boolean
    link2?: boolean
    link3?: boolean
    whatsappLink?: boolean
    isPaid?: boolean
    qrCodeUrl?: boolean
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type eventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    posterUrl?: boolean
    EventMode?: boolean
    EventType?: boolean
    eventHeaderImage?: boolean
    EventName?: boolean
    description?: boolean
    tagline?: boolean
    prizes?: boolean
    TeamSize?: boolean
    Venue?: boolean
    EventUrl?: boolean
    applicationStatus?: boolean
    applicationStartDate?: boolean
    applicationEndDate?: boolean
    clubName?: boolean
    clubId?: boolean
    university?: boolean
    createdAt?: boolean
    startDate?: boolean
    endDate?: boolean
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    Form?: boolean
    Fees?: boolean
    link1?: boolean
    link2?: boolean
    link3?: boolean
    whatsappLink?: boolean
    isPaid?: boolean
    qrCodeUrl?: boolean
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type eventSelectScalar = {
    id?: boolean
    posterUrl?: boolean
    EventMode?: boolean
    EventType?: boolean
    eventHeaderImage?: boolean
    EventName?: boolean
    description?: boolean
    tagline?: boolean
    prizes?: boolean
    TeamSize?: boolean
    Venue?: boolean
    EventUrl?: boolean
    applicationStatus?: boolean
    applicationStartDate?: boolean
    applicationEndDate?: boolean
    clubName?: boolean
    clubId?: boolean
    university?: boolean
    createdAt?: boolean
    startDate?: boolean
    endDate?: boolean
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    Form?: boolean
    Fees?: boolean
    link1?: boolean
    link2?: boolean
    link3?: boolean
    whatsappLink?: boolean
    isPaid?: boolean
    qrCodeUrl?: boolean
  }

  export type eventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "posterUrl" | "EventMode" | "EventType" | "eventHeaderImage" | "EventName" | "description" | "tagline" | "prizes" | "TeamSize" | "Venue" | "EventUrl" | "applicationStatus" | "applicationStartDate" | "applicationEndDate" | "clubName" | "clubId" | "university" | "createdAt" | "startDate" | "endDate" | "collegeStudentsOnly" | "participationFee" | "contactEmail" | "contactPhone" | "Form" | "Fees" | "link1" | "link2" | "link3" | "whatsappLink" | "isPaid" | "qrCodeUrl", ExtArgs["result"]["event"]>
  export type eventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | clubsDefaultArgs<ExtArgs>
    speakers?: boolean | event$speakersArgs<ExtArgs>
    attendees?: boolean | event$attendeesArgs<ExtArgs>
    announcements?: boolean | event$announcementsArgs<ExtArgs>
    galleries?: boolean | event$galleriesArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type eventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }
  export type eventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }

  export type $eventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "event"
    objects: {
      club: Prisma.$clubsPayload<ExtArgs>
      speakers: Prisma.$speakersPayload<ExtArgs>[]
      attendees: Prisma.$userEventsPayload<ExtArgs>[]
      announcements: Prisma.$eventAnnouncementPayload<ExtArgs>[]
      galleries: Prisma.$eventGalleryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      posterUrl: string | null
      EventMode: string
      EventType: string
      eventHeaderImage: string | null
      EventName: string
      description: string
      tagline: string | null
      prizes: string
      TeamSize: number
      Venue: string
      EventUrl: string | null
      applicationStatus: string
      applicationStartDate: string | null
      applicationEndDate: string | null
      clubName: string
      clubId: string
      university: string
      createdAt: Date
      startDate: string
      endDate: string | null
      collegeStudentsOnly: boolean
      participationFee: boolean
      contactEmail: string
      contactPhone: string | null
      Form: string | null
      Fees: string | null
      link1: string | null
      link2: string | null
      link3: string | null
      whatsappLink: string | null
      isPaid: boolean
      qrCodeUrl: string | null
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type eventGetPayload<S extends boolean | null | undefined | eventDefaultArgs> = $Result.GetResult<Prisma.$eventPayload, S>

  type eventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<eventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface eventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['event'], meta: { name: 'event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {eventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends eventFindUniqueArgs>(args: SelectSubset<T, eventFindUniqueArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {eventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends eventFindUniqueOrThrowArgs>(args: SelectSubset<T, eventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends eventFindFirstArgs>(args?: SelectSubset<T, eventFindFirstArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends eventFindFirstOrThrowArgs>(args?: SelectSubset<T, eventFindFirstOrThrowArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends eventFindManyArgs>(args?: SelectSubset<T, eventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Event.
     * @param {eventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends eventCreateArgs>(args: SelectSubset<T, eventCreateArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {eventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends eventCreateManyArgs>(args?: SelectSubset<T, eventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {eventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends eventCreateManyAndReturnArgs>(args?: SelectSubset<T, eventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Event.
     * @param {eventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends eventDeleteArgs>(args: SelectSubset<T, eventDeleteArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Event.
     * @param {eventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends eventUpdateArgs>(args: SelectSubset<T, eventUpdateArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {eventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends eventDeleteManyArgs>(args?: SelectSubset<T, eventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends eventUpdateManyArgs>(args: SelectSubset<T, eventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {eventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends eventUpdateManyAndReturnArgs>(args: SelectSubset<T, eventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Event.
     * @param {eventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends eventUpsertArgs>(args: SelectSubset<T, eventUpsertArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends eventCountArgs>(
      args?: Subset<T, eventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends eventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: eventGroupByArgs['orderBy'] }
        : { orderBy?: eventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, eventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the event model
   */
  readonly fields: eventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__eventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    club<T extends clubsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, clubsDefaultArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    speakers<T extends event$speakersArgs<ExtArgs> = {}>(args?: Subset<T, event$speakersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$speakersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    attendees<T extends event$attendeesArgs<ExtArgs> = {}>(args?: Subset<T, event$attendeesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    announcements<T extends event$announcementsArgs<ExtArgs> = {}>(args?: Subset<T, event$announcementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    galleries<T extends event$galleriesArgs<ExtArgs> = {}>(args?: Subset<T, event$galleriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the event model
   */
  interface eventFieldRefs {
    readonly id: FieldRef<"event", 'String'>
    readonly posterUrl: FieldRef<"event", 'String'>
    readonly EventMode: FieldRef<"event", 'String'>
    readonly EventType: FieldRef<"event", 'String'>
    readonly eventHeaderImage: FieldRef<"event", 'String'>
    readonly EventName: FieldRef<"event", 'String'>
    readonly description: FieldRef<"event", 'String'>
    readonly tagline: FieldRef<"event", 'String'>
    readonly prizes: FieldRef<"event", 'String'>
    readonly TeamSize: FieldRef<"event", 'Int'>
    readonly Venue: FieldRef<"event", 'String'>
    readonly EventUrl: FieldRef<"event", 'String'>
    readonly applicationStatus: FieldRef<"event", 'String'>
    readonly applicationStartDate: FieldRef<"event", 'String'>
    readonly applicationEndDate: FieldRef<"event", 'String'>
    readonly clubName: FieldRef<"event", 'String'>
    readonly clubId: FieldRef<"event", 'String'>
    readonly university: FieldRef<"event", 'String'>
    readonly createdAt: FieldRef<"event", 'DateTime'>
    readonly startDate: FieldRef<"event", 'String'>
    readonly endDate: FieldRef<"event", 'String'>
    readonly collegeStudentsOnly: FieldRef<"event", 'Boolean'>
    readonly participationFee: FieldRef<"event", 'Boolean'>
    readonly contactEmail: FieldRef<"event", 'String'>
    readonly contactPhone: FieldRef<"event", 'String'>
    readonly Form: FieldRef<"event", 'String'>
    readonly Fees: FieldRef<"event", 'String'>
    readonly link1: FieldRef<"event", 'String'>
    readonly link2: FieldRef<"event", 'String'>
    readonly link3: FieldRef<"event", 'String'>
    readonly whatsappLink: FieldRef<"event", 'String'>
    readonly isPaid: FieldRef<"event", 'Boolean'>
    readonly qrCodeUrl: FieldRef<"event", 'String'>
  }
    

  // Custom InputTypes
  /**
   * event findUnique
   */
  export type eventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * Filter, which event to fetch.
     */
    where: eventWhereUniqueInput
  }

  /**
   * event findUniqueOrThrow
   */
  export type eventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * Filter, which event to fetch.
     */
    where: eventWhereUniqueInput
  }

  /**
   * event findFirst
   */
  export type eventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * Filter, which event to fetch.
     */
    where?: eventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of events to fetch.
     */
    orderBy?: eventOrderByWithRelationInput | eventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for events.
     */
    cursor?: eventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * event findFirstOrThrow
   */
  export type eventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * Filter, which event to fetch.
     */
    where?: eventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of events to fetch.
     */
    orderBy?: eventOrderByWithRelationInput | eventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for events.
     */
    cursor?: eventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * event findMany
   */
  export type eventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * Filter, which events to fetch.
     */
    where?: eventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of events to fetch.
     */
    orderBy?: eventOrderByWithRelationInput | eventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing events.
     */
    cursor?: eventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * event create
   */
  export type eventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * The data needed to create a event.
     */
    data: XOR<eventCreateInput, eventUncheckedCreateInput>
  }

  /**
   * event createMany
   */
  export type eventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many events.
     */
    data: eventCreateManyInput | eventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * event createManyAndReturn
   */
  export type eventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * The data used to create many events.
     */
    data: eventCreateManyInput | eventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * event update
   */
  export type eventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * The data needed to update a event.
     */
    data: XOR<eventUpdateInput, eventUncheckedUpdateInput>
    /**
     * Choose, which event to update.
     */
    where: eventWhereUniqueInput
  }

  /**
   * event updateMany
   */
  export type eventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update events.
     */
    data: XOR<eventUpdateManyMutationInput, eventUncheckedUpdateManyInput>
    /**
     * Filter which events to update
     */
    where?: eventWhereInput
    /**
     * Limit how many events to update.
     */
    limit?: number
  }

  /**
   * event updateManyAndReturn
   */
  export type eventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * The data used to update events.
     */
    data: XOR<eventUpdateManyMutationInput, eventUncheckedUpdateManyInput>
    /**
     * Filter which events to update
     */
    where?: eventWhereInput
    /**
     * Limit how many events to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * event upsert
   */
  export type eventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * The filter to search for the event to update in case it exists.
     */
    where: eventWhereUniqueInput
    /**
     * In case the event found by the `where` argument doesn't exist, create a new event with this data.
     */
    create: XOR<eventCreateInput, eventUncheckedCreateInput>
    /**
     * In case the event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<eventUpdateInput, eventUncheckedUpdateInput>
  }

  /**
   * event delete
   */
  export type eventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
    /**
     * Filter which event to delete.
     */
    where: eventWhereUniqueInput
  }

  /**
   * event deleteMany
   */
  export type eventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which events to delete
     */
    where?: eventWhereInput
    /**
     * Limit how many events to delete.
     */
    limit?: number
  }

  /**
   * event.speakers
   */
  export type event$speakersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the speakers
     */
    select?: speakersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the speakers
     */
    omit?: speakersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: speakersInclude<ExtArgs> | null
    where?: speakersWhereInput
    orderBy?: speakersOrderByWithRelationInput | speakersOrderByWithRelationInput[]
    cursor?: speakersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpeakersScalarFieldEnum | SpeakersScalarFieldEnum[]
  }

  /**
   * event.attendees
   */
  export type event$attendeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    where?: userEventsWhereInput
    orderBy?: userEventsOrderByWithRelationInput | userEventsOrderByWithRelationInput[]
    cursor?: userEventsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserEventsScalarFieldEnum | UserEventsScalarFieldEnum[]
  }

  /**
   * event.announcements
   */
  export type event$announcementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    where?: eventAnnouncementWhereInput
    orderBy?: eventAnnouncementOrderByWithRelationInput | eventAnnouncementOrderByWithRelationInput[]
    cursor?: eventAnnouncementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventAnnouncementScalarFieldEnum | EventAnnouncementScalarFieldEnum[]
  }

  /**
   * event.galleries
   */
  export type event$galleriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    where?: eventGalleryWhereInput
    orderBy?: eventGalleryOrderByWithRelationInput | eventGalleryOrderByWithRelationInput[]
    cursor?: eventGalleryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventGalleryScalarFieldEnum | EventGalleryScalarFieldEnum[]
  }

  /**
   * event without action
   */
  export type eventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the event
     */
    select?: eventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the event
     */
    omit?: eventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventInclude<ExtArgs> | null
  }


  /**
   * Model eventAnnouncement
   */

  export type AggregateEventAnnouncement = {
    _count: EventAnnouncementCountAggregateOutputType | null
    _min: EventAnnouncementMinAggregateOutputType | null
    _max: EventAnnouncementMaxAggregateOutputType | null
  }

  export type EventAnnouncementMinAggregateOutputType = {
    id: string | null
    Title: string | null
    Description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    eventId: string | null
  }

  export type EventAnnouncementMaxAggregateOutputType = {
    id: string | null
    Title: string | null
    Description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    eventId: string | null
  }

  export type EventAnnouncementCountAggregateOutputType = {
    id: number
    Title: number
    Description: number
    createdAt: number
    updatedAt: number
    eventId: number
    _all: number
  }


  export type EventAnnouncementMinAggregateInputType = {
    id?: true
    Title?: true
    Description?: true
    createdAt?: true
    updatedAt?: true
    eventId?: true
  }

  export type EventAnnouncementMaxAggregateInputType = {
    id?: true
    Title?: true
    Description?: true
    createdAt?: true
    updatedAt?: true
    eventId?: true
  }

  export type EventAnnouncementCountAggregateInputType = {
    id?: true
    Title?: true
    Description?: true
    createdAt?: true
    updatedAt?: true
    eventId?: true
    _all?: true
  }

  export type EventAnnouncementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which eventAnnouncement to aggregate.
     */
    where?: eventAnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of eventAnnouncements to fetch.
     */
    orderBy?: eventAnnouncementOrderByWithRelationInput | eventAnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: eventAnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` eventAnnouncements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` eventAnnouncements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned eventAnnouncements
    **/
    _count?: true | EventAnnouncementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventAnnouncementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventAnnouncementMaxAggregateInputType
  }

  export type GetEventAnnouncementAggregateType<T extends EventAnnouncementAggregateArgs> = {
        [P in keyof T & keyof AggregateEventAnnouncement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventAnnouncement[P]>
      : GetScalarType<T[P], AggregateEventAnnouncement[P]>
  }




  export type eventAnnouncementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: eventAnnouncementWhereInput
    orderBy?: eventAnnouncementOrderByWithAggregationInput | eventAnnouncementOrderByWithAggregationInput[]
    by: EventAnnouncementScalarFieldEnum[] | EventAnnouncementScalarFieldEnum
    having?: eventAnnouncementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventAnnouncementCountAggregateInputType | true
    _min?: EventAnnouncementMinAggregateInputType
    _max?: EventAnnouncementMaxAggregateInputType
  }

  export type EventAnnouncementGroupByOutputType = {
    id: string
    Title: string
    Description: string
    createdAt: Date
    updatedAt: Date | null
    eventId: string
    _count: EventAnnouncementCountAggregateOutputType | null
    _min: EventAnnouncementMinAggregateOutputType | null
    _max: EventAnnouncementMaxAggregateOutputType | null
  }

  type GetEventAnnouncementGroupByPayload<T extends eventAnnouncementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventAnnouncementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventAnnouncementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventAnnouncementGroupByOutputType[P]>
            : GetScalarType<T[P], EventAnnouncementGroupByOutputType[P]>
        }
      >
    >


  export type eventAnnouncementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Title?: boolean
    Description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventAnnouncement"]>

  export type eventAnnouncementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Title?: boolean
    Description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventAnnouncement"]>

  export type eventAnnouncementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Title?: boolean
    Description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventAnnouncement"]>

  export type eventAnnouncementSelectScalar = {
    id?: boolean
    Title?: boolean
    Description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventId?: boolean
  }

  export type eventAnnouncementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "Title" | "Description" | "createdAt" | "updatedAt" | "eventId", ExtArgs["result"]["eventAnnouncement"]>
  export type eventAnnouncementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }
  export type eventAnnouncementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }
  export type eventAnnouncementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }

  export type $eventAnnouncementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "eventAnnouncement"
    objects: {
      event: Prisma.$eventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      Title: string
      Description: string
      createdAt: Date
      updatedAt: Date | null
      eventId: string
    }, ExtArgs["result"]["eventAnnouncement"]>
    composites: {}
  }

  type eventAnnouncementGetPayload<S extends boolean | null | undefined | eventAnnouncementDefaultArgs> = $Result.GetResult<Prisma.$eventAnnouncementPayload, S>

  type eventAnnouncementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<eventAnnouncementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventAnnouncementCountAggregateInputType | true
    }

  export interface eventAnnouncementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['eventAnnouncement'], meta: { name: 'eventAnnouncement' } }
    /**
     * Find zero or one EventAnnouncement that matches the filter.
     * @param {eventAnnouncementFindUniqueArgs} args - Arguments to find a EventAnnouncement
     * @example
     * // Get one EventAnnouncement
     * const eventAnnouncement = await prisma.eventAnnouncement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends eventAnnouncementFindUniqueArgs>(args: SelectSubset<T, eventAnnouncementFindUniqueArgs<ExtArgs>>): Prisma__eventAnnouncementClient<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventAnnouncement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {eventAnnouncementFindUniqueOrThrowArgs} args - Arguments to find a EventAnnouncement
     * @example
     * // Get one EventAnnouncement
     * const eventAnnouncement = await prisma.eventAnnouncement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends eventAnnouncementFindUniqueOrThrowArgs>(args: SelectSubset<T, eventAnnouncementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__eventAnnouncementClient<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventAnnouncement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventAnnouncementFindFirstArgs} args - Arguments to find a EventAnnouncement
     * @example
     * // Get one EventAnnouncement
     * const eventAnnouncement = await prisma.eventAnnouncement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends eventAnnouncementFindFirstArgs>(args?: SelectSubset<T, eventAnnouncementFindFirstArgs<ExtArgs>>): Prisma__eventAnnouncementClient<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventAnnouncement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventAnnouncementFindFirstOrThrowArgs} args - Arguments to find a EventAnnouncement
     * @example
     * // Get one EventAnnouncement
     * const eventAnnouncement = await prisma.eventAnnouncement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends eventAnnouncementFindFirstOrThrowArgs>(args?: SelectSubset<T, eventAnnouncementFindFirstOrThrowArgs<ExtArgs>>): Prisma__eventAnnouncementClient<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventAnnouncements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventAnnouncementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventAnnouncements
     * const eventAnnouncements = await prisma.eventAnnouncement.findMany()
     * 
     * // Get first 10 EventAnnouncements
     * const eventAnnouncements = await prisma.eventAnnouncement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventAnnouncementWithIdOnly = await prisma.eventAnnouncement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends eventAnnouncementFindManyArgs>(args?: SelectSubset<T, eventAnnouncementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventAnnouncement.
     * @param {eventAnnouncementCreateArgs} args - Arguments to create a EventAnnouncement.
     * @example
     * // Create one EventAnnouncement
     * const EventAnnouncement = await prisma.eventAnnouncement.create({
     *   data: {
     *     // ... data to create a EventAnnouncement
     *   }
     * })
     * 
     */
    create<T extends eventAnnouncementCreateArgs>(args: SelectSubset<T, eventAnnouncementCreateArgs<ExtArgs>>): Prisma__eventAnnouncementClient<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventAnnouncements.
     * @param {eventAnnouncementCreateManyArgs} args - Arguments to create many EventAnnouncements.
     * @example
     * // Create many EventAnnouncements
     * const eventAnnouncement = await prisma.eventAnnouncement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends eventAnnouncementCreateManyArgs>(args?: SelectSubset<T, eventAnnouncementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventAnnouncements and returns the data saved in the database.
     * @param {eventAnnouncementCreateManyAndReturnArgs} args - Arguments to create many EventAnnouncements.
     * @example
     * // Create many EventAnnouncements
     * const eventAnnouncement = await prisma.eventAnnouncement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventAnnouncements and only return the `id`
     * const eventAnnouncementWithIdOnly = await prisma.eventAnnouncement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends eventAnnouncementCreateManyAndReturnArgs>(args?: SelectSubset<T, eventAnnouncementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventAnnouncement.
     * @param {eventAnnouncementDeleteArgs} args - Arguments to delete one EventAnnouncement.
     * @example
     * // Delete one EventAnnouncement
     * const EventAnnouncement = await prisma.eventAnnouncement.delete({
     *   where: {
     *     // ... filter to delete one EventAnnouncement
     *   }
     * })
     * 
     */
    delete<T extends eventAnnouncementDeleteArgs>(args: SelectSubset<T, eventAnnouncementDeleteArgs<ExtArgs>>): Prisma__eventAnnouncementClient<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventAnnouncement.
     * @param {eventAnnouncementUpdateArgs} args - Arguments to update one EventAnnouncement.
     * @example
     * // Update one EventAnnouncement
     * const eventAnnouncement = await prisma.eventAnnouncement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends eventAnnouncementUpdateArgs>(args: SelectSubset<T, eventAnnouncementUpdateArgs<ExtArgs>>): Prisma__eventAnnouncementClient<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventAnnouncements.
     * @param {eventAnnouncementDeleteManyArgs} args - Arguments to filter EventAnnouncements to delete.
     * @example
     * // Delete a few EventAnnouncements
     * const { count } = await prisma.eventAnnouncement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends eventAnnouncementDeleteManyArgs>(args?: SelectSubset<T, eventAnnouncementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventAnnouncements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventAnnouncementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventAnnouncements
     * const eventAnnouncement = await prisma.eventAnnouncement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends eventAnnouncementUpdateManyArgs>(args: SelectSubset<T, eventAnnouncementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventAnnouncements and returns the data updated in the database.
     * @param {eventAnnouncementUpdateManyAndReturnArgs} args - Arguments to update many EventAnnouncements.
     * @example
     * // Update many EventAnnouncements
     * const eventAnnouncement = await prisma.eventAnnouncement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventAnnouncements and only return the `id`
     * const eventAnnouncementWithIdOnly = await prisma.eventAnnouncement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends eventAnnouncementUpdateManyAndReturnArgs>(args: SelectSubset<T, eventAnnouncementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventAnnouncement.
     * @param {eventAnnouncementUpsertArgs} args - Arguments to update or create a EventAnnouncement.
     * @example
     * // Update or create a EventAnnouncement
     * const eventAnnouncement = await prisma.eventAnnouncement.upsert({
     *   create: {
     *     // ... data to create a EventAnnouncement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventAnnouncement we want to update
     *   }
     * })
     */
    upsert<T extends eventAnnouncementUpsertArgs>(args: SelectSubset<T, eventAnnouncementUpsertArgs<ExtArgs>>): Prisma__eventAnnouncementClient<$Result.GetResult<Prisma.$eventAnnouncementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventAnnouncements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventAnnouncementCountArgs} args - Arguments to filter EventAnnouncements to count.
     * @example
     * // Count the number of EventAnnouncements
     * const count = await prisma.eventAnnouncement.count({
     *   where: {
     *     // ... the filter for the EventAnnouncements we want to count
     *   }
     * })
    **/
    count<T extends eventAnnouncementCountArgs>(
      args?: Subset<T, eventAnnouncementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventAnnouncementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventAnnouncement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAnnouncementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAnnouncementAggregateArgs>(args: Subset<T, EventAnnouncementAggregateArgs>): Prisma.PrismaPromise<GetEventAnnouncementAggregateType<T>>

    /**
     * Group by EventAnnouncement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventAnnouncementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends eventAnnouncementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: eventAnnouncementGroupByArgs['orderBy'] }
        : { orderBy?: eventAnnouncementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, eventAnnouncementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventAnnouncementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the eventAnnouncement model
   */
  readonly fields: eventAnnouncementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for eventAnnouncement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__eventAnnouncementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends eventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, eventDefaultArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the eventAnnouncement model
   */
  interface eventAnnouncementFieldRefs {
    readonly id: FieldRef<"eventAnnouncement", 'String'>
    readonly Title: FieldRef<"eventAnnouncement", 'String'>
    readonly Description: FieldRef<"eventAnnouncement", 'String'>
    readonly createdAt: FieldRef<"eventAnnouncement", 'DateTime'>
    readonly updatedAt: FieldRef<"eventAnnouncement", 'DateTime'>
    readonly eventId: FieldRef<"eventAnnouncement", 'String'>
  }
    

  // Custom InputTypes
  /**
   * eventAnnouncement findUnique
   */
  export type eventAnnouncementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which eventAnnouncement to fetch.
     */
    where: eventAnnouncementWhereUniqueInput
  }

  /**
   * eventAnnouncement findUniqueOrThrow
   */
  export type eventAnnouncementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which eventAnnouncement to fetch.
     */
    where: eventAnnouncementWhereUniqueInput
  }

  /**
   * eventAnnouncement findFirst
   */
  export type eventAnnouncementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which eventAnnouncement to fetch.
     */
    where?: eventAnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of eventAnnouncements to fetch.
     */
    orderBy?: eventAnnouncementOrderByWithRelationInput | eventAnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for eventAnnouncements.
     */
    cursor?: eventAnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` eventAnnouncements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` eventAnnouncements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of eventAnnouncements.
     */
    distinct?: EventAnnouncementScalarFieldEnum | EventAnnouncementScalarFieldEnum[]
  }

  /**
   * eventAnnouncement findFirstOrThrow
   */
  export type eventAnnouncementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which eventAnnouncement to fetch.
     */
    where?: eventAnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of eventAnnouncements to fetch.
     */
    orderBy?: eventAnnouncementOrderByWithRelationInput | eventAnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for eventAnnouncements.
     */
    cursor?: eventAnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` eventAnnouncements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` eventAnnouncements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of eventAnnouncements.
     */
    distinct?: EventAnnouncementScalarFieldEnum | EventAnnouncementScalarFieldEnum[]
  }

  /**
   * eventAnnouncement findMany
   */
  export type eventAnnouncementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which eventAnnouncements to fetch.
     */
    where?: eventAnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of eventAnnouncements to fetch.
     */
    orderBy?: eventAnnouncementOrderByWithRelationInput | eventAnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing eventAnnouncements.
     */
    cursor?: eventAnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` eventAnnouncements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` eventAnnouncements.
     */
    skip?: number
    distinct?: EventAnnouncementScalarFieldEnum | EventAnnouncementScalarFieldEnum[]
  }

  /**
   * eventAnnouncement create
   */
  export type eventAnnouncementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * The data needed to create a eventAnnouncement.
     */
    data: XOR<eventAnnouncementCreateInput, eventAnnouncementUncheckedCreateInput>
  }

  /**
   * eventAnnouncement createMany
   */
  export type eventAnnouncementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many eventAnnouncements.
     */
    data: eventAnnouncementCreateManyInput | eventAnnouncementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * eventAnnouncement createManyAndReturn
   */
  export type eventAnnouncementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * The data used to create many eventAnnouncements.
     */
    data: eventAnnouncementCreateManyInput | eventAnnouncementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * eventAnnouncement update
   */
  export type eventAnnouncementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * The data needed to update a eventAnnouncement.
     */
    data: XOR<eventAnnouncementUpdateInput, eventAnnouncementUncheckedUpdateInput>
    /**
     * Choose, which eventAnnouncement to update.
     */
    where: eventAnnouncementWhereUniqueInput
  }

  /**
   * eventAnnouncement updateMany
   */
  export type eventAnnouncementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update eventAnnouncements.
     */
    data: XOR<eventAnnouncementUpdateManyMutationInput, eventAnnouncementUncheckedUpdateManyInput>
    /**
     * Filter which eventAnnouncements to update
     */
    where?: eventAnnouncementWhereInput
    /**
     * Limit how many eventAnnouncements to update.
     */
    limit?: number
  }

  /**
   * eventAnnouncement updateManyAndReturn
   */
  export type eventAnnouncementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * The data used to update eventAnnouncements.
     */
    data: XOR<eventAnnouncementUpdateManyMutationInput, eventAnnouncementUncheckedUpdateManyInput>
    /**
     * Filter which eventAnnouncements to update
     */
    where?: eventAnnouncementWhereInput
    /**
     * Limit how many eventAnnouncements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * eventAnnouncement upsert
   */
  export type eventAnnouncementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * The filter to search for the eventAnnouncement to update in case it exists.
     */
    where: eventAnnouncementWhereUniqueInput
    /**
     * In case the eventAnnouncement found by the `where` argument doesn't exist, create a new eventAnnouncement with this data.
     */
    create: XOR<eventAnnouncementCreateInput, eventAnnouncementUncheckedCreateInput>
    /**
     * In case the eventAnnouncement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<eventAnnouncementUpdateInput, eventAnnouncementUncheckedUpdateInput>
  }

  /**
   * eventAnnouncement delete
   */
  export type eventAnnouncementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
    /**
     * Filter which eventAnnouncement to delete.
     */
    where: eventAnnouncementWhereUniqueInput
  }

  /**
   * eventAnnouncement deleteMany
   */
  export type eventAnnouncementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which eventAnnouncements to delete
     */
    where?: eventAnnouncementWhereInput
    /**
     * Limit how many eventAnnouncements to delete.
     */
    limit?: number
  }

  /**
   * eventAnnouncement without action
   */
  export type eventAnnouncementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventAnnouncement
     */
    select?: eventAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventAnnouncement
     */
    omit?: eventAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventAnnouncementInclude<ExtArgs> | null
  }


  /**
   * Model eventGallery
   */

  export type AggregateEventGallery = {
    _count: EventGalleryCountAggregateOutputType | null
    _min: EventGalleryMinAggregateOutputType | null
    _max: EventGalleryMaxAggregateOutputType | null
  }

  export type EventGalleryMinAggregateOutputType = {
    id: string | null
    imageUrl: string | null
    caption: string | null
    createdAt: Date | null
    updatedAt: Date | null
    eventId: string | null
  }

  export type EventGalleryMaxAggregateOutputType = {
    id: string | null
    imageUrl: string | null
    caption: string | null
    createdAt: Date | null
    updatedAt: Date | null
    eventId: string | null
  }

  export type EventGalleryCountAggregateOutputType = {
    id: number
    imageUrl: number
    caption: number
    createdAt: number
    updatedAt: number
    eventId: number
    _all: number
  }


  export type EventGalleryMinAggregateInputType = {
    id?: true
    imageUrl?: true
    caption?: true
    createdAt?: true
    updatedAt?: true
    eventId?: true
  }

  export type EventGalleryMaxAggregateInputType = {
    id?: true
    imageUrl?: true
    caption?: true
    createdAt?: true
    updatedAt?: true
    eventId?: true
  }

  export type EventGalleryCountAggregateInputType = {
    id?: true
    imageUrl?: true
    caption?: true
    createdAt?: true
    updatedAt?: true
    eventId?: true
    _all?: true
  }

  export type EventGalleryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which eventGallery to aggregate.
     */
    where?: eventGalleryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of eventGalleries to fetch.
     */
    orderBy?: eventGalleryOrderByWithRelationInput | eventGalleryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: eventGalleryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` eventGalleries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` eventGalleries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned eventGalleries
    **/
    _count?: true | EventGalleryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventGalleryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventGalleryMaxAggregateInputType
  }

  export type GetEventGalleryAggregateType<T extends EventGalleryAggregateArgs> = {
        [P in keyof T & keyof AggregateEventGallery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventGallery[P]>
      : GetScalarType<T[P], AggregateEventGallery[P]>
  }




  export type eventGalleryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: eventGalleryWhereInput
    orderBy?: eventGalleryOrderByWithAggregationInput | eventGalleryOrderByWithAggregationInput[]
    by: EventGalleryScalarFieldEnum[] | EventGalleryScalarFieldEnum
    having?: eventGalleryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventGalleryCountAggregateInputType | true
    _min?: EventGalleryMinAggregateInputType
    _max?: EventGalleryMaxAggregateInputType
  }

  export type EventGalleryGroupByOutputType = {
    id: string
    imageUrl: string
    caption: string | null
    createdAt: Date
    updatedAt: Date | null
    eventId: string
    _count: EventGalleryCountAggregateOutputType | null
    _min: EventGalleryMinAggregateOutputType | null
    _max: EventGalleryMaxAggregateOutputType | null
  }

  type GetEventGalleryGroupByPayload<T extends eventGalleryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGalleryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGalleryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGalleryGroupByOutputType[P]>
            : GetScalarType<T[P], EventGalleryGroupByOutputType[P]>
        }
      >
    >


  export type eventGallerySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageUrl?: boolean
    caption?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventGallery"]>

  export type eventGallerySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageUrl?: boolean
    caption?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventGallery"]>

  export type eventGallerySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageUrl?: boolean
    caption?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventId?: boolean
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventGallery"]>

  export type eventGallerySelectScalar = {
    id?: boolean
    imageUrl?: boolean
    caption?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventId?: boolean
  }

  export type eventGalleryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imageUrl" | "caption" | "createdAt" | "updatedAt" | "eventId", ExtArgs["result"]["eventGallery"]>
  export type eventGalleryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }
  export type eventGalleryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }
  export type eventGalleryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | eventDefaultArgs<ExtArgs>
  }

  export type $eventGalleryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "eventGallery"
    objects: {
      event: Prisma.$eventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imageUrl: string
      caption: string | null
      createdAt: Date
      updatedAt: Date | null
      eventId: string
    }, ExtArgs["result"]["eventGallery"]>
    composites: {}
  }

  type eventGalleryGetPayload<S extends boolean | null | undefined | eventGalleryDefaultArgs> = $Result.GetResult<Prisma.$eventGalleryPayload, S>

  type eventGalleryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<eventGalleryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventGalleryCountAggregateInputType | true
    }

  export interface eventGalleryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['eventGallery'], meta: { name: 'eventGallery' } }
    /**
     * Find zero or one EventGallery that matches the filter.
     * @param {eventGalleryFindUniqueArgs} args - Arguments to find a EventGallery
     * @example
     * // Get one EventGallery
     * const eventGallery = await prisma.eventGallery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends eventGalleryFindUniqueArgs>(args: SelectSubset<T, eventGalleryFindUniqueArgs<ExtArgs>>): Prisma__eventGalleryClient<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventGallery that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {eventGalleryFindUniqueOrThrowArgs} args - Arguments to find a EventGallery
     * @example
     * // Get one EventGallery
     * const eventGallery = await prisma.eventGallery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends eventGalleryFindUniqueOrThrowArgs>(args: SelectSubset<T, eventGalleryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__eventGalleryClient<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventGallery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventGalleryFindFirstArgs} args - Arguments to find a EventGallery
     * @example
     * // Get one EventGallery
     * const eventGallery = await prisma.eventGallery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends eventGalleryFindFirstArgs>(args?: SelectSubset<T, eventGalleryFindFirstArgs<ExtArgs>>): Prisma__eventGalleryClient<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventGallery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventGalleryFindFirstOrThrowArgs} args - Arguments to find a EventGallery
     * @example
     * // Get one EventGallery
     * const eventGallery = await prisma.eventGallery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends eventGalleryFindFirstOrThrowArgs>(args?: SelectSubset<T, eventGalleryFindFirstOrThrowArgs<ExtArgs>>): Prisma__eventGalleryClient<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventGalleries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventGalleryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventGalleries
     * const eventGalleries = await prisma.eventGallery.findMany()
     * 
     * // Get first 10 EventGalleries
     * const eventGalleries = await prisma.eventGallery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventGalleryWithIdOnly = await prisma.eventGallery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends eventGalleryFindManyArgs>(args?: SelectSubset<T, eventGalleryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventGallery.
     * @param {eventGalleryCreateArgs} args - Arguments to create a EventGallery.
     * @example
     * // Create one EventGallery
     * const EventGallery = await prisma.eventGallery.create({
     *   data: {
     *     // ... data to create a EventGallery
     *   }
     * })
     * 
     */
    create<T extends eventGalleryCreateArgs>(args: SelectSubset<T, eventGalleryCreateArgs<ExtArgs>>): Prisma__eventGalleryClient<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventGalleries.
     * @param {eventGalleryCreateManyArgs} args - Arguments to create many EventGalleries.
     * @example
     * // Create many EventGalleries
     * const eventGallery = await prisma.eventGallery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends eventGalleryCreateManyArgs>(args?: SelectSubset<T, eventGalleryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventGalleries and returns the data saved in the database.
     * @param {eventGalleryCreateManyAndReturnArgs} args - Arguments to create many EventGalleries.
     * @example
     * // Create many EventGalleries
     * const eventGallery = await prisma.eventGallery.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventGalleries and only return the `id`
     * const eventGalleryWithIdOnly = await prisma.eventGallery.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends eventGalleryCreateManyAndReturnArgs>(args?: SelectSubset<T, eventGalleryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventGallery.
     * @param {eventGalleryDeleteArgs} args - Arguments to delete one EventGallery.
     * @example
     * // Delete one EventGallery
     * const EventGallery = await prisma.eventGallery.delete({
     *   where: {
     *     // ... filter to delete one EventGallery
     *   }
     * })
     * 
     */
    delete<T extends eventGalleryDeleteArgs>(args: SelectSubset<T, eventGalleryDeleteArgs<ExtArgs>>): Prisma__eventGalleryClient<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventGallery.
     * @param {eventGalleryUpdateArgs} args - Arguments to update one EventGallery.
     * @example
     * // Update one EventGallery
     * const eventGallery = await prisma.eventGallery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends eventGalleryUpdateArgs>(args: SelectSubset<T, eventGalleryUpdateArgs<ExtArgs>>): Prisma__eventGalleryClient<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventGalleries.
     * @param {eventGalleryDeleteManyArgs} args - Arguments to filter EventGalleries to delete.
     * @example
     * // Delete a few EventGalleries
     * const { count } = await prisma.eventGallery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends eventGalleryDeleteManyArgs>(args?: SelectSubset<T, eventGalleryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventGalleries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventGalleryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventGalleries
     * const eventGallery = await prisma.eventGallery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends eventGalleryUpdateManyArgs>(args: SelectSubset<T, eventGalleryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventGalleries and returns the data updated in the database.
     * @param {eventGalleryUpdateManyAndReturnArgs} args - Arguments to update many EventGalleries.
     * @example
     * // Update many EventGalleries
     * const eventGallery = await prisma.eventGallery.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventGalleries and only return the `id`
     * const eventGalleryWithIdOnly = await prisma.eventGallery.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends eventGalleryUpdateManyAndReturnArgs>(args: SelectSubset<T, eventGalleryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventGallery.
     * @param {eventGalleryUpsertArgs} args - Arguments to update or create a EventGallery.
     * @example
     * // Update or create a EventGallery
     * const eventGallery = await prisma.eventGallery.upsert({
     *   create: {
     *     // ... data to create a EventGallery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventGallery we want to update
     *   }
     * })
     */
    upsert<T extends eventGalleryUpsertArgs>(args: SelectSubset<T, eventGalleryUpsertArgs<ExtArgs>>): Prisma__eventGalleryClient<$Result.GetResult<Prisma.$eventGalleryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventGalleries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventGalleryCountArgs} args - Arguments to filter EventGalleries to count.
     * @example
     * // Count the number of EventGalleries
     * const count = await prisma.eventGallery.count({
     *   where: {
     *     // ... the filter for the EventGalleries we want to count
     *   }
     * })
    **/
    count<T extends eventGalleryCountArgs>(
      args?: Subset<T, eventGalleryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventGalleryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventGallery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGalleryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventGalleryAggregateArgs>(args: Subset<T, EventGalleryAggregateArgs>): Prisma.PrismaPromise<GetEventGalleryAggregateType<T>>

    /**
     * Group by EventGallery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventGalleryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends eventGalleryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: eventGalleryGroupByArgs['orderBy'] }
        : { orderBy?: eventGalleryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, eventGalleryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGalleryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the eventGallery model
   */
  readonly fields: eventGalleryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for eventGallery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__eventGalleryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends eventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, eventDefaultArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the eventGallery model
   */
  interface eventGalleryFieldRefs {
    readonly id: FieldRef<"eventGallery", 'String'>
    readonly imageUrl: FieldRef<"eventGallery", 'String'>
    readonly caption: FieldRef<"eventGallery", 'String'>
    readonly createdAt: FieldRef<"eventGallery", 'DateTime'>
    readonly updatedAt: FieldRef<"eventGallery", 'DateTime'>
    readonly eventId: FieldRef<"eventGallery", 'String'>
  }
    

  // Custom InputTypes
  /**
   * eventGallery findUnique
   */
  export type eventGalleryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * Filter, which eventGallery to fetch.
     */
    where: eventGalleryWhereUniqueInput
  }

  /**
   * eventGallery findUniqueOrThrow
   */
  export type eventGalleryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * Filter, which eventGallery to fetch.
     */
    where: eventGalleryWhereUniqueInput
  }

  /**
   * eventGallery findFirst
   */
  export type eventGalleryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * Filter, which eventGallery to fetch.
     */
    where?: eventGalleryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of eventGalleries to fetch.
     */
    orderBy?: eventGalleryOrderByWithRelationInput | eventGalleryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for eventGalleries.
     */
    cursor?: eventGalleryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` eventGalleries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` eventGalleries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of eventGalleries.
     */
    distinct?: EventGalleryScalarFieldEnum | EventGalleryScalarFieldEnum[]
  }

  /**
   * eventGallery findFirstOrThrow
   */
  export type eventGalleryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * Filter, which eventGallery to fetch.
     */
    where?: eventGalleryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of eventGalleries to fetch.
     */
    orderBy?: eventGalleryOrderByWithRelationInput | eventGalleryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for eventGalleries.
     */
    cursor?: eventGalleryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` eventGalleries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` eventGalleries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of eventGalleries.
     */
    distinct?: EventGalleryScalarFieldEnum | EventGalleryScalarFieldEnum[]
  }

  /**
   * eventGallery findMany
   */
  export type eventGalleryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * Filter, which eventGalleries to fetch.
     */
    where?: eventGalleryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of eventGalleries to fetch.
     */
    orderBy?: eventGalleryOrderByWithRelationInput | eventGalleryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing eventGalleries.
     */
    cursor?: eventGalleryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` eventGalleries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` eventGalleries.
     */
    skip?: number
    distinct?: EventGalleryScalarFieldEnum | EventGalleryScalarFieldEnum[]
  }

  /**
   * eventGallery create
   */
  export type eventGalleryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * The data needed to create a eventGallery.
     */
    data: XOR<eventGalleryCreateInput, eventGalleryUncheckedCreateInput>
  }

  /**
   * eventGallery createMany
   */
  export type eventGalleryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many eventGalleries.
     */
    data: eventGalleryCreateManyInput | eventGalleryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * eventGallery createManyAndReturn
   */
  export type eventGalleryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * The data used to create many eventGalleries.
     */
    data: eventGalleryCreateManyInput | eventGalleryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * eventGallery update
   */
  export type eventGalleryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * The data needed to update a eventGallery.
     */
    data: XOR<eventGalleryUpdateInput, eventGalleryUncheckedUpdateInput>
    /**
     * Choose, which eventGallery to update.
     */
    where: eventGalleryWhereUniqueInput
  }

  /**
   * eventGallery updateMany
   */
  export type eventGalleryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update eventGalleries.
     */
    data: XOR<eventGalleryUpdateManyMutationInput, eventGalleryUncheckedUpdateManyInput>
    /**
     * Filter which eventGalleries to update
     */
    where?: eventGalleryWhereInput
    /**
     * Limit how many eventGalleries to update.
     */
    limit?: number
  }

  /**
   * eventGallery updateManyAndReturn
   */
  export type eventGalleryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * The data used to update eventGalleries.
     */
    data: XOR<eventGalleryUpdateManyMutationInput, eventGalleryUncheckedUpdateManyInput>
    /**
     * Filter which eventGalleries to update
     */
    where?: eventGalleryWhereInput
    /**
     * Limit how many eventGalleries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * eventGallery upsert
   */
  export type eventGalleryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * The filter to search for the eventGallery to update in case it exists.
     */
    where: eventGalleryWhereUniqueInput
    /**
     * In case the eventGallery found by the `where` argument doesn't exist, create a new eventGallery with this data.
     */
    create: XOR<eventGalleryCreateInput, eventGalleryUncheckedCreateInput>
    /**
     * In case the eventGallery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<eventGalleryUpdateInput, eventGalleryUncheckedUpdateInput>
  }

  /**
   * eventGallery delete
   */
  export type eventGalleryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
    /**
     * Filter which eventGallery to delete.
     */
    where: eventGalleryWhereUniqueInput
  }

  /**
   * eventGallery deleteMany
   */
  export type eventGalleryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which eventGalleries to delete
     */
    where?: eventGalleryWhereInput
    /**
     * Limit how many eventGalleries to delete.
     */
    limit?: number
  }

  /**
   * eventGallery without action
   */
  export type eventGalleryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the eventGallery
     */
    select?: eventGallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the eventGallery
     */
    omit?: eventGalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: eventGalleryInclude<ExtArgs> | null
  }


  /**
   * Model clubAnnouncement
   */

  export type AggregateClubAnnouncement = {
    _count: ClubAnnouncementCountAggregateOutputType | null
    _min: ClubAnnouncementMinAggregateOutputType | null
    _max: ClubAnnouncementMaxAggregateOutputType | null
  }

  export type ClubAnnouncementMinAggregateOutputType = {
    id: string | null
    Title: string | null
    Description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    clubId: string | null
  }

  export type ClubAnnouncementMaxAggregateOutputType = {
    id: string | null
    Title: string | null
    Description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    clubId: string | null
  }

  export type ClubAnnouncementCountAggregateOutputType = {
    id: number
    Title: number
    Description: number
    createdAt: number
    updatedAt: number
    clubId: number
    _all: number
  }


  export type ClubAnnouncementMinAggregateInputType = {
    id?: true
    Title?: true
    Description?: true
    createdAt?: true
    updatedAt?: true
    clubId?: true
  }

  export type ClubAnnouncementMaxAggregateInputType = {
    id?: true
    Title?: true
    Description?: true
    createdAt?: true
    updatedAt?: true
    clubId?: true
  }

  export type ClubAnnouncementCountAggregateInputType = {
    id?: true
    Title?: true
    Description?: true
    createdAt?: true
    updatedAt?: true
    clubId?: true
    _all?: true
  }

  export type ClubAnnouncementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which clubAnnouncement to aggregate.
     */
    where?: clubAnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of clubAnnouncements to fetch.
     */
    orderBy?: clubAnnouncementOrderByWithRelationInput | clubAnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: clubAnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` clubAnnouncements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` clubAnnouncements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned clubAnnouncements
    **/
    _count?: true | ClubAnnouncementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClubAnnouncementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClubAnnouncementMaxAggregateInputType
  }

  export type GetClubAnnouncementAggregateType<T extends ClubAnnouncementAggregateArgs> = {
        [P in keyof T & keyof AggregateClubAnnouncement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClubAnnouncement[P]>
      : GetScalarType<T[P], AggregateClubAnnouncement[P]>
  }




  export type clubAnnouncementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: clubAnnouncementWhereInput
    orderBy?: clubAnnouncementOrderByWithAggregationInput | clubAnnouncementOrderByWithAggregationInput[]
    by: ClubAnnouncementScalarFieldEnum[] | ClubAnnouncementScalarFieldEnum
    having?: clubAnnouncementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClubAnnouncementCountAggregateInputType | true
    _min?: ClubAnnouncementMinAggregateInputType
    _max?: ClubAnnouncementMaxAggregateInputType
  }

  export type ClubAnnouncementGroupByOutputType = {
    id: string
    Title: string
    Description: string
    createdAt: Date
    updatedAt: Date | null
    clubId: string
    _count: ClubAnnouncementCountAggregateOutputType | null
    _min: ClubAnnouncementMinAggregateOutputType | null
    _max: ClubAnnouncementMaxAggregateOutputType | null
  }

  type GetClubAnnouncementGroupByPayload<T extends clubAnnouncementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClubAnnouncementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClubAnnouncementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClubAnnouncementGroupByOutputType[P]>
            : GetScalarType<T[P], ClubAnnouncementGroupByOutputType[P]>
        }
      >
    >


  export type clubAnnouncementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Title?: boolean
    Description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clubId?: boolean
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubAnnouncement"]>

  export type clubAnnouncementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Title?: boolean
    Description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clubId?: boolean
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubAnnouncement"]>

  export type clubAnnouncementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Title?: boolean
    Description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clubId?: boolean
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clubAnnouncement"]>

  export type clubAnnouncementSelectScalar = {
    id?: boolean
    Title?: boolean
    Description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clubId?: boolean
  }

  export type clubAnnouncementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "Title" | "Description" | "createdAt" | "updatedAt" | "clubId", ExtArgs["result"]["clubAnnouncement"]>
  export type clubAnnouncementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }
  export type clubAnnouncementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }
  export type clubAnnouncementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    club?: boolean | clubsDefaultArgs<ExtArgs>
  }

  export type $clubAnnouncementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "clubAnnouncement"
    objects: {
      club: Prisma.$clubsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      Title: string
      Description: string
      createdAt: Date
      updatedAt: Date | null
      clubId: string
    }, ExtArgs["result"]["clubAnnouncement"]>
    composites: {}
  }

  type clubAnnouncementGetPayload<S extends boolean | null | undefined | clubAnnouncementDefaultArgs> = $Result.GetResult<Prisma.$clubAnnouncementPayload, S>

  type clubAnnouncementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<clubAnnouncementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClubAnnouncementCountAggregateInputType | true
    }

  export interface clubAnnouncementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['clubAnnouncement'], meta: { name: 'clubAnnouncement' } }
    /**
     * Find zero or one ClubAnnouncement that matches the filter.
     * @param {clubAnnouncementFindUniqueArgs} args - Arguments to find a ClubAnnouncement
     * @example
     * // Get one ClubAnnouncement
     * const clubAnnouncement = await prisma.clubAnnouncement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends clubAnnouncementFindUniqueArgs>(args: SelectSubset<T, clubAnnouncementFindUniqueArgs<ExtArgs>>): Prisma__clubAnnouncementClient<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClubAnnouncement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {clubAnnouncementFindUniqueOrThrowArgs} args - Arguments to find a ClubAnnouncement
     * @example
     * // Get one ClubAnnouncement
     * const clubAnnouncement = await prisma.clubAnnouncement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends clubAnnouncementFindUniqueOrThrowArgs>(args: SelectSubset<T, clubAnnouncementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__clubAnnouncementClient<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClubAnnouncement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubAnnouncementFindFirstArgs} args - Arguments to find a ClubAnnouncement
     * @example
     * // Get one ClubAnnouncement
     * const clubAnnouncement = await prisma.clubAnnouncement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends clubAnnouncementFindFirstArgs>(args?: SelectSubset<T, clubAnnouncementFindFirstArgs<ExtArgs>>): Prisma__clubAnnouncementClient<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClubAnnouncement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubAnnouncementFindFirstOrThrowArgs} args - Arguments to find a ClubAnnouncement
     * @example
     * // Get one ClubAnnouncement
     * const clubAnnouncement = await prisma.clubAnnouncement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends clubAnnouncementFindFirstOrThrowArgs>(args?: SelectSubset<T, clubAnnouncementFindFirstOrThrowArgs<ExtArgs>>): Prisma__clubAnnouncementClient<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClubAnnouncements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubAnnouncementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClubAnnouncements
     * const clubAnnouncements = await prisma.clubAnnouncement.findMany()
     * 
     * // Get first 10 ClubAnnouncements
     * const clubAnnouncements = await prisma.clubAnnouncement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clubAnnouncementWithIdOnly = await prisma.clubAnnouncement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends clubAnnouncementFindManyArgs>(args?: SelectSubset<T, clubAnnouncementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClubAnnouncement.
     * @param {clubAnnouncementCreateArgs} args - Arguments to create a ClubAnnouncement.
     * @example
     * // Create one ClubAnnouncement
     * const ClubAnnouncement = await prisma.clubAnnouncement.create({
     *   data: {
     *     // ... data to create a ClubAnnouncement
     *   }
     * })
     * 
     */
    create<T extends clubAnnouncementCreateArgs>(args: SelectSubset<T, clubAnnouncementCreateArgs<ExtArgs>>): Prisma__clubAnnouncementClient<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClubAnnouncements.
     * @param {clubAnnouncementCreateManyArgs} args - Arguments to create many ClubAnnouncements.
     * @example
     * // Create many ClubAnnouncements
     * const clubAnnouncement = await prisma.clubAnnouncement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends clubAnnouncementCreateManyArgs>(args?: SelectSubset<T, clubAnnouncementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClubAnnouncements and returns the data saved in the database.
     * @param {clubAnnouncementCreateManyAndReturnArgs} args - Arguments to create many ClubAnnouncements.
     * @example
     * // Create many ClubAnnouncements
     * const clubAnnouncement = await prisma.clubAnnouncement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClubAnnouncements and only return the `id`
     * const clubAnnouncementWithIdOnly = await prisma.clubAnnouncement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends clubAnnouncementCreateManyAndReturnArgs>(args?: SelectSubset<T, clubAnnouncementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClubAnnouncement.
     * @param {clubAnnouncementDeleteArgs} args - Arguments to delete one ClubAnnouncement.
     * @example
     * // Delete one ClubAnnouncement
     * const ClubAnnouncement = await prisma.clubAnnouncement.delete({
     *   where: {
     *     // ... filter to delete one ClubAnnouncement
     *   }
     * })
     * 
     */
    delete<T extends clubAnnouncementDeleteArgs>(args: SelectSubset<T, clubAnnouncementDeleteArgs<ExtArgs>>): Prisma__clubAnnouncementClient<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClubAnnouncement.
     * @param {clubAnnouncementUpdateArgs} args - Arguments to update one ClubAnnouncement.
     * @example
     * // Update one ClubAnnouncement
     * const clubAnnouncement = await prisma.clubAnnouncement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends clubAnnouncementUpdateArgs>(args: SelectSubset<T, clubAnnouncementUpdateArgs<ExtArgs>>): Prisma__clubAnnouncementClient<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClubAnnouncements.
     * @param {clubAnnouncementDeleteManyArgs} args - Arguments to filter ClubAnnouncements to delete.
     * @example
     * // Delete a few ClubAnnouncements
     * const { count } = await prisma.clubAnnouncement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends clubAnnouncementDeleteManyArgs>(args?: SelectSubset<T, clubAnnouncementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClubAnnouncements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubAnnouncementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClubAnnouncements
     * const clubAnnouncement = await prisma.clubAnnouncement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends clubAnnouncementUpdateManyArgs>(args: SelectSubset<T, clubAnnouncementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClubAnnouncements and returns the data updated in the database.
     * @param {clubAnnouncementUpdateManyAndReturnArgs} args - Arguments to update many ClubAnnouncements.
     * @example
     * // Update many ClubAnnouncements
     * const clubAnnouncement = await prisma.clubAnnouncement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClubAnnouncements and only return the `id`
     * const clubAnnouncementWithIdOnly = await prisma.clubAnnouncement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends clubAnnouncementUpdateManyAndReturnArgs>(args: SelectSubset<T, clubAnnouncementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClubAnnouncement.
     * @param {clubAnnouncementUpsertArgs} args - Arguments to update or create a ClubAnnouncement.
     * @example
     * // Update or create a ClubAnnouncement
     * const clubAnnouncement = await prisma.clubAnnouncement.upsert({
     *   create: {
     *     // ... data to create a ClubAnnouncement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClubAnnouncement we want to update
     *   }
     * })
     */
    upsert<T extends clubAnnouncementUpsertArgs>(args: SelectSubset<T, clubAnnouncementUpsertArgs<ExtArgs>>): Prisma__clubAnnouncementClient<$Result.GetResult<Prisma.$clubAnnouncementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClubAnnouncements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubAnnouncementCountArgs} args - Arguments to filter ClubAnnouncements to count.
     * @example
     * // Count the number of ClubAnnouncements
     * const count = await prisma.clubAnnouncement.count({
     *   where: {
     *     // ... the filter for the ClubAnnouncements we want to count
     *   }
     * })
    **/
    count<T extends clubAnnouncementCountArgs>(
      args?: Subset<T, clubAnnouncementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClubAnnouncementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClubAnnouncement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClubAnnouncementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClubAnnouncementAggregateArgs>(args: Subset<T, ClubAnnouncementAggregateArgs>): Prisma.PrismaPromise<GetClubAnnouncementAggregateType<T>>

    /**
     * Group by ClubAnnouncement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {clubAnnouncementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends clubAnnouncementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: clubAnnouncementGroupByArgs['orderBy'] }
        : { orderBy?: clubAnnouncementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, clubAnnouncementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClubAnnouncementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the clubAnnouncement model
   */
  readonly fields: clubAnnouncementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for clubAnnouncement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__clubAnnouncementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    club<T extends clubsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, clubsDefaultArgs<ExtArgs>>): Prisma__clubsClient<$Result.GetResult<Prisma.$clubsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the clubAnnouncement model
   */
  interface clubAnnouncementFieldRefs {
    readonly id: FieldRef<"clubAnnouncement", 'String'>
    readonly Title: FieldRef<"clubAnnouncement", 'String'>
    readonly Description: FieldRef<"clubAnnouncement", 'String'>
    readonly createdAt: FieldRef<"clubAnnouncement", 'DateTime'>
    readonly updatedAt: FieldRef<"clubAnnouncement", 'DateTime'>
    readonly clubId: FieldRef<"clubAnnouncement", 'String'>
  }
    

  // Custom InputTypes
  /**
   * clubAnnouncement findUnique
   */
  export type clubAnnouncementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which clubAnnouncement to fetch.
     */
    where: clubAnnouncementWhereUniqueInput
  }

  /**
   * clubAnnouncement findUniqueOrThrow
   */
  export type clubAnnouncementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which clubAnnouncement to fetch.
     */
    where: clubAnnouncementWhereUniqueInput
  }

  /**
   * clubAnnouncement findFirst
   */
  export type clubAnnouncementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which clubAnnouncement to fetch.
     */
    where?: clubAnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of clubAnnouncements to fetch.
     */
    orderBy?: clubAnnouncementOrderByWithRelationInput | clubAnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for clubAnnouncements.
     */
    cursor?: clubAnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` clubAnnouncements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` clubAnnouncements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of clubAnnouncements.
     */
    distinct?: ClubAnnouncementScalarFieldEnum | ClubAnnouncementScalarFieldEnum[]
  }

  /**
   * clubAnnouncement findFirstOrThrow
   */
  export type clubAnnouncementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which clubAnnouncement to fetch.
     */
    where?: clubAnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of clubAnnouncements to fetch.
     */
    orderBy?: clubAnnouncementOrderByWithRelationInput | clubAnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for clubAnnouncements.
     */
    cursor?: clubAnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` clubAnnouncements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` clubAnnouncements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of clubAnnouncements.
     */
    distinct?: ClubAnnouncementScalarFieldEnum | ClubAnnouncementScalarFieldEnum[]
  }

  /**
   * clubAnnouncement findMany
   */
  export type clubAnnouncementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which clubAnnouncements to fetch.
     */
    where?: clubAnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of clubAnnouncements to fetch.
     */
    orderBy?: clubAnnouncementOrderByWithRelationInput | clubAnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing clubAnnouncements.
     */
    cursor?: clubAnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` clubAnnouncements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` clubAnnouncements.
     */
    skip?: number
    distinct?: ClubAnnouncementScalarFieldEnum | ClubAnnouncementScalarFieldEnum[]
  }

  /**
   * clubAnnouncement create
   */
  export type clubAnnouncementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * The data needed to create a clubAnnouncement.
     */
    data: XOR<clubAnnouncementCreateInput, clubAnnouncementUncheckedCreateInput>
  }

  /**
   * clubAnnouncement createMany
   */
  export type clubAnnouncementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many clubAnnouncements.
     */
    data: clubAnnouncementCreateManyInput | clubAnnouncementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * clubAnnouncement createManyAndReturn
   */
  export type clubAnnouncementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * The data used to create many clubAnnouncements.
     */
    data: clubAnnouncementCreateManyInput | clubAnnouncementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * clubAnnouncement update
   */
  export type clubAnnouncementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * The data needed to update a clubAnnouncement.
     */
    data: XOR<clubAnnouncementUpdateInput, clubAnnouncementUncheckedUpdateInput>
    /**
     * Choose, which clubAnnouncement to update.
     */
    where: clubAnnouncementWhereUniqueInput
  }

  /**
   * clubAnnouncement updateMany
   */
  export type clubAnnouncementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update clubAnnouncements.
     */
    data: XOR<clubAnnouncementUpdateManyMutationInput, clubAnnouncementUncheckedUpdateManyInput>
    /**
     * Filter which clubAnnouncements to update
     */
    where?: clubAnnouncementWhereInput
    /**
     * Limit how many clubAnnouncements to update.
     */
    limit?: number
  }

  /**
   * clubAnnouncement updateManyAndReturn
   */
  export type clubAnnouncementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * The data used to update clubAnnouncements.
     */
    data: XOR<clubAnnouncementUpdateManyMutationInput, clubAnnouncementUncheckedUpdateManyInput>
    /**
     * Filter which clubAnnouncements to update
     */
    where?: clubAnnouncementWhereInput
    /**
     * Limit how many clubAnnouncements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * clubAnnouncement upsert
   */
  export type clubAnnouncementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * The filter to search for the clubAnnouncement to update in case it exists.
     */
    where: clubAnnouncementWhereUniqueInput
    /**
     * In case the clubAnnouncement found by the `where` argument doesn't exist, create a new clubAnnouncement with this data.
     */
    create: XOR<clubAnnouncementCreateInput, clubAnnouncementUncheckedCreateInput>
    /**
     * In case the clubAnnouncement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<clubAnnouncementUpdateInput, clubAnnouncementUncheckedUpdateInput>
  }

  /**
   * clubAnnouncement delete
   */
  export type clubAnnouncementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
    /**
     * Filter which clubAnnouncement to delete.
     */
    where: clubAnnouncementWhereUniqueInput
  }

  /**
   * clubAnnouncement deleteMany
   */
  export type clubAnnouncementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which clubAnnouncements to delete
     */
    where?: clubAnnouncementWhereInput
    /**
     * Limit how many clubAnnouncements to delete.
     */
    limit?: number
  }

  /**
   * clubAnnouncement without action
   */
  export type clubAnnouncementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the clubAnnouncement
     */
    select?: clubAnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the clubAnnouncement
     */
    omit?: clubAnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: clubAnnouncementInclude<ExtArgs> | null
  }


  /**
   * Model userEvents
   */

  export type AggregateUserEvents = {
    _count: UserEventsCountAggregateOutputType | null
    _min: UserEventsMinAggregateOutputType | null
    _max: UserEventsMaxAggregateOutputType | null
  }

  export type UserEventsMinAggregateOutputType = {
    userId: string | null
    eventId: string | null
    uniquePassId: string | null
    joinedAt: Date | null
    paymentScreenshotUrl: string | null
    paymentStatus: string | null
    paymentVerifiedAt: Date | null
  }

  export type UserEventsMaxAggregateOutputType = {
    userId: string | null
    eventId: string | null
    uniquePassId: string | null
    joinedAt: Date | null
    paymentScreenshotUrl: string | null
    paymentStatus: string | null
    paymentVerifiedAt: Date | null
  }

  export type UserEventsCountAggregateOutputType = {
    userId: number
    eventId: number
    uniquePassId: number
    joinedAt: number
    paymentScreenshotUrl: number
    paymentStatus: number
    paymentVerifiedAt: number
    _all: number
  }


  export type UserEventsMinAggregateInputType = {
    userId?: true
    eventId?: true
    uniquePassId?: true
    joinedAt?: true
    paymentScreenshotUrl?: true
    paymentStatus?: true
    paymentVerifiedAt?: true
  }

  export type UserEventsMaxAggregateInputType = {
    userId?: true
    eventId?: true
    uniquePassId?: true
    joinedAt?: true
    paymentScreenshotUrl?: true
    paymentStatus?: true
    paymentVerifiedAt?: true
  }

  export type UserEventsCountAggregateInputType = {
    userId?: true
    eventId?: true
    uniquePassId?: true
    joinedAt?: true
    paymentScreenshotUrl?: true
    paymentStatus?: true
    paymentVerifiedAt?: true
    _all?: true
  }

  export type UserEventsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which userEvents to aggregate.
     */
    where?: userEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of userEvents to fetch.
     */
    orderBy?: userEventsOrderByWithRelationInput | userEventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` userEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` userEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned userEvents
    **/
    _count?: true | UserEventsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserEventsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserEventsMaxAggregateInputType
  }

  export type GetUserEventsAggregateType<T extends UserEventsAggregateArgs> = {
        [P in keyof T & keyof AggregateUserEvents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserEvents[P]>
      : GetScalarType<T[P], AggregateUserEvents[P]>
  }




  export type userEventsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userEventsWhereInput
    orderBy?: userEventsOrderByWithAggregationInput | userEventsOrderByWithAggregationInput[]
    by: UserEventsScalarFieldEnum[] | UserEventsScalarFieldEnum
    having?: userEventsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserEventsCountAggregateInputType | true
    _min?: UserEventsMinAggregateInputType
    _max?: UserEventsMaxAggregateInputType
  }

  export type UserEventsGroupByOutputType = {
    userId: string
    eventId: string
    uniquePassId: string | null
    joinedAt: Date
    paymentScreenshotUrl: string | null
    paymentStatus: string
    paymentVerifiedAt: Date | null
    _count: UserEventsCountAggregateOutputType | null
    _min: UserEventsMinAggregateOutputType | null
    _max: UserEventsMaxAggregateOutputType | null
  }

  type GetUserEventsGroupByPayload<T extends userEventsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserEventsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserEventsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserEventsGroupByOutputType[P]>
            : GetScalarType<T[P], UserEventsGroupByOutputType[P]>
        }
      >
    >


  export type userEventsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    eventId?: boolean
    uniquePassId?: boolean
    joinedAt?: boolean
    paymentScreenshotUrl?: boolean
    paymentStatus?: boolean
    paymentVerifiedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userEvents"]>

  export type userEventsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    eventId?: boolean
    uniquePassId?: boolean
    joinedAt?: boolean
    paymentScreenshotUrl?: boolean
    paymentStatus?: boolean
    paymentVerifiedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userEvents"]>

  export type userEventsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    eventId?: boolean
    uniquePassId?: boolean
    joinedAt?: boolean
    paymentScreenshotUrl?: boolean
    paymentStatus?: boolean
    paymentVerifiedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    event?: boolean | eventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userEvents"]>

  export type userEventsSelectScalar = {
    userId?: boolean
    eventId?: boolean
    uniquePassId?: boolean
    joinedAt?: boolean
    paymentScreenshotUrl?: boolean
    paymentStatus?: boolean
    paymentVerifiedAt?: boolean
  }

  export type userEventsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "eventId" | "uniquePassId" | "joinedAt" | "paymentScreenshotUrl" | "paymentStatus" | "paymentVerifiedAt", ExtArgs["result"]["userEvents"]>
  export type userEventsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    event?: boolean | eventDefaultArgs<ExtArgs>
  }
  export type userEventsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    event?: boolean | eventDefaultArgs<ExtArgs>
  }
  export type userEventsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    event?: boolean | eventDefaultArgs<ExtArgs>
  }

  export type $userEventsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "userEvents"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      event: Prisma.$eventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      eventId: string
      uniquePassId: string | null
      joinedAt: Date
      paymentScreenshotUrl: string | null
      paymentStatus: string
      paymentVerifiedAt: Date | null
    }, ExtArgs["result"]["userEvents"]>
    composites: {}
  }

  type userEventsGetPayload<S extends boolean | null | undefined | userEventsDefaultArgs> = $Result.GetResult<Prisma.$userEventsPayload, S>

  type userEventsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userEventsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserEventsCountAggregateInputType | true
    }

  export interface userEventsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['userEvents'], meta: { name: 'userEvents' } }
    /**
     * Find zero or one UserEvents that matches the filter.
     * @param {userEventsFindUniqueArgs} args - Arguments to find a UserEvents
     * @example
     * // Get one UserEvents
     * const userEvents = await prisma.userEvents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userEventsFindUniqueArgs>(args: SelectSubset<T, userEventsFindUniqueArgs<ExtArgs>>): Prisma__userEventsClient<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserEvents that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userEventsFindUniqueOrThrowArgs} args - Arguments to find a UserEvents
     * @example
     * // Get one UserEvents
     * const userEvents = await prisma.userEvents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userEventsFindUniqueOrThrowArgs>(args: SelectSubset<T, userEventsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userEventsClient<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userEventsFindFirstArgs} args - Arguments to find a UserEvents
     * @example
     * // Get one UserEvents
     * const userEvents = await prisma.userEvents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userEventsFindFirstArgs>(args?: SelectSubset<T, userEventsFindFirstArgs<ExtArgs>>): Prisma__userEventsClient<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserEvents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userEventsFindFirstOrThrowArgs} args - Arguments to find a UserEvents
     * @example
     * // Get one UserEvents
     * const userEvents = await prisma.userEvents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userEventsFindFirstOrThrowArgs>(args?: SelectSubset<T, userEventsFindFirstOrThrowArgs<ExtArgs>>): Prisma__userEventsClient<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userEventsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserEvents
     * const userEvents = await prisma.userEvents.findMany()
     * 
     * // Get first 10 UserEvents
     * const userEvents = await prisma.userEvents.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userEventsWithUserIdOnly = await prisma.userEvents.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends userEventsFindManyArgs>(args?: SelectSubset<T, userEventsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserEvents.
     * @param {userEventsCreateArgs} args - Arguments to create a UserEvents.
     * @example
     * // Create one UserEvents
     * const UserEvents = await prisma.userEvents.create({
     *   data: {
     *     // ... data to create a UserEvents
     *   }
     * })
     * 
     */
    create<T extends userEventsCreateArgs>(args: SelectSubset<T, userEventsCreateArgs<ExtArgs>>): Prisma__userEventsClient<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserEvents.
     * @param {userEventsCreateManyArgs} args - Arguments to create many UserEvents.
     * @example
     * // Create many UserEvents
     * const userEvents = await prisma.userEvents.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userEventsCreateManyArgs>(args?: SelectSubset<T, userEventsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserEvents and returns the data saved in the database.
     * @param {userEventsCreateManyAndReturnArgs} args - Arguments to create many UserEvents.
     * @example
     * // Create many UserEvents
     * const userEvents = await prisma.userEvents.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserEvents and only return the `userId`
     * const userEventsWithUserIdOnly = await prisma.userEvents.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends userEventsCreateManyAndReturnArgs>(args?: SelectSubset<T, userEventsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserEvents.
     * @param {userEventsDeleteArgs} args - Arguments to delete one UserEvents.
     * @example
     * // Delete one UserEvents
     * const UserEvents = await prisma.userEvents.delete({
     *   where: {
     *     // ... filter to delete one UserEvents
     *   }
     * })
     * 
     */
    delete<T extends userEventsDeleteArgs>(args: SelectSubset<T, userEventsDeleteArgs<ExtArgs>>): Prisma__userEventsClient<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserEvents.
     * @param {userEventsUpdateArgs} args - Arguments to update one UserEvents.
     * @example
     * // Update one UserEvents
     * const userEvents = await prisma.userEvents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends userEventsUpdateArgs>(args: SelectSubset<T, userEventsUpdateArgs<ExtArgs>>): Prisma__userEventsClient<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserEvents.
     * @param {userEventsDeleteManyArgs} args - Arguments to filter UserEvents to delete.
     * @example
     * // Delete a few UserEvents
     * const { count } = await prisma.userEvents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userEventsDeleteManyArgs>(args?: SelectSubset<T, userEventsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userEventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserEvents
     * const userEvents = await prisma.userEvents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends userEventsUpdateManyArgs>(args: SelectSubset<T, userEventsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserEvents and returns the data updated in the database.
     * @param {userEventsUpdateManyAndReturnArgs} args - Arguments to update many UserEvents.
     * @example
     * // Update many UserEvents
     * const userEvents = await prisma.userEvents.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserEvents and only return the `userId`
     * const userEventsWithUserIdOnly = await prisma.userEvents.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends userEventsUpdateManyAndReturnArgs>(args: SelectSubset<T, userEventsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserEvents.
     * @param {userEventsUpsertArgs} args - Arguments to update or create a UserEvents.
     * @example
     * // Update or create a UserEvents
     * const userEvents = await prisma.userEvents.upsert({
     *   create: {
     *     // ... data to create a UserEvents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserEvents we want to update
     *   }
     * })
     */
    upsert<T extends userEventsUpsertArgs>(args: SelectSubset<T, userEventsUpsertArgs<ExtArgs>>): Prisma__userEventsClient<$Result.GetResult<Prisma.$userEventsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userEventsCountArgs} args - Arguments to filter UserEvents to count.
     * @example
     * // Count the number of UserEvents
     * const count = await prisma.userEvents.count({
     *   where: {
     *     // ... the filter for the UserEvents we want to count
     *   }
     * })
    **/
    count<T extends userEventsCountArgs>(
      args?: Subset<T, userEventsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserEventsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserEventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserEventsAggregateArgs>(args: Subset<T, UserEventsAggregateArgs>): Prisma.PrismaPromise<GetUserEventsAggregateType<T>>

    /**
     * Group by UserEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userEventsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends userEventsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userEventsGroupByArgs['orderBy'] }
        : { orderBy?: userEventsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, userEventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserEventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the userEvents model
   */
  readonly fields: userEventsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for userEvents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userEventsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    event<T extends eventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, eventDefaultArgs<ExtArgs>>): Prisma__eventClient<$Result.GetResult<Prisma.$eventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the userEvents model
   */
  interface userEventsFieldRefs {
    readonly userId: FieldRef<"userEvents", 'String'>
    readonly eventId: FieldRef<"userEvents", 'String'>
    readonly uniquePassId: FieldRef<"userEvents", 'String'>
    readonly joinedAt: FieldRef<"userEvents", 'DateTime'>
    readonly paymentScreenshotUrl: FieldRef<"userEvents", 'String'>
    readonly paymentStatus: FieldRef<"userEvents", 'String'>
    readonly paymentVerifiedAt: FieldRef<"userEvents", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * userEvents findUnique
   */
  export type userEventsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * Filter, which userEvents to fetch.
     */
    where: userEventsWhereUniqueInput
  }

  /**
   * userEvents findUniqueOrThrow
   */
  export type userEventsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * Filter, which userEvents to fetch.
     */
    where: userEventsWhereUniqueInput
  }

  /**
   * userEvents findFirst
   */
  export type userEventsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * Filter, which userEvents to fetch.
     */
    where?: userEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of userEvents to fetch.
     */
    orderBy?: userEventsOrderByWithRelationInput | userEventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for userEvents.
     */
    cursor?: userEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` userEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` userEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of userEvents.
     */
    distinct?: UserEventsScalarFieldEnum | UserEventsScalarFieldEnum[]
  }

  /**
   * userEvents findFirstOrThrow
   */
  export type userEventsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * Filter, which userEvents to fetch.
     */
    where?: userEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of userEvents to fetch.
     */
    orderBy?: userEventsOrderByWithRelationInput | userEventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for userEvents.
     */
    cursor?: userEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` userEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` userEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of userEvents.
     */
    distinct?: UserEventsScalarFieldEnum | UserEventsScalarFieldEnum[]
  }

  /**
   * userEvents findMany
   */
  export type userEventsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * Filter, which userEvents to fetch.
     */
    where?: userEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of userEvents to fetch.
     */
    orderBy?: userEventsOrderByWithRelationInput | userEventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing userEvents.
     */
    cursor?: userEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` userEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` userEvents.
     */
    skip?: number
    distinct?: UserEventsScalarFieldEnum | UserEventsScalarFieldEnum[]
  }

  /**
   * userEvents create
   */
  export type userEventsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * The data needed to create a userEvents.
     */
    data: XOR<userEventsCreateInput, userEventsUncheckedCreateInput>
  }

  /**
   * userEvents createMany
   */
  export type userEventsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many userEvents.
     */
    data: userEventsCreateManyInput | userEventsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * userEvents createManyAndReturn
   */
  export type userEventsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * The data used to create many userEvents.
     */
    data: userEventsCreateManyInput | userEventsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * userEvents update
   */
  export type userEventsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * The data needed to update a userEvents.
     */
    data: XOR<userEventsUpdateInput, userEventsUncheckedUpdateInput>
    /**
     * Choose, which userEvents to update.
     */
    where: userEventsWhereUniqueInput
  }

  /**
   * userEvents updateMany
   */
  export type userEventsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update userEvents.
     */
    data: XOR<userEventsUpdateManyMutationInput, userEventsUncheckedUpdateManyInput>
    /**
     * Filter which userEvents to update
     */
    where?: userEventsWhereInput
    /**
     * Limit how many userEvents to update.
     */
    limit?: number
  }

  /**
   * userEvents updateManyAndReturn
   */
  export type userEventsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * The data used to update userEvents.
     */
    data: XOR<userEventsUpdateManyMutationInput, userEventsUncheckedUpdateManyInput>
    /**
     * Filter which userEvents to update
     */
    where?: userEventsWhereInput
    /**
     * Limit how many userEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * userEvents upsert
   */
  export type userEventsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * The filter to search for the userEvents to update in case it exists.
     */
    where: userEventsWhereUniqueInput
    /**
     * In case the userEvents found by the `where` argument doesn't exist, create a new userEvents with this data.
     */
    create: XOR<userEventsCreateInput, userEventsUncheckedCreateInput>
    /**
     * In case the userEvents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userEventsUpdateInput, userEventsUncheckedUpdateInput>
  }

  /**
   * userEvents delete
   */
  export type userEventsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
    /**
     * Filter which userEvents to delete.
     */
    where: userEventsWhereUniqueInput
  }

  /**
   * userEvents deleteMany
   */
  export type userEventsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which userEvents to delete
     */
    where?: userEventsWhereInput
    /**
     * Limit how many userEvents to delete.
     */
    limit?: number
  }

  /**
   * userEvents without action
   */
  export type userEventsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the userEvents
     */
    select?: userEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the userEvents
     */
    omit?: userEventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userEventsInclude<ExtArgs> | null
  }


  /**
   * Model PostUpvote
   */

  export type AggregatePostUpvote = {
    _count: PostUpvoteCountAggregateOutputType | null
    _min: PostUpvoteMinAggregateOutputType | null
    _max: PostUpvoteMaxAggregateOutputType | null
  }

  export type PostUpvoteMinAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type PostUpvoteMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type PostUpvoteCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type PostUpvoteMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
  }

  export type PostUpvoteMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
  }

  export type PostUpvoteCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type PostUpvoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PostUpvote to aggregate.
     */
    where?: PostUpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostUpvotes to fetch.
     */
    orderBy?: PostUpvoteOrderByWithRelationInput | PostUpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostUpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostUpvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostUpvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PostUpvotes
    **/
    _count?: true | PostUpvoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostUpvoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostUpvoteMaxAggregateInputType
  }

  export type GetPostUpvoteAggregateType<T extends PostUpvoteAggregateArgs> = {
        [P in keyof T & keyof AggregatePostUpvote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePostUpvote[P]>
      : GetScalarType<T[P], AggregatePostUpvote[P]>
  }




  export type PostUpvoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostUpvoteWhereInput
    orderBy?: PostUpvoteOrderByWithAggregationInput | PostUpvoteOrderByWithAggregationInput[]
    by: PostUpvoteScalarFieldEnum[] | PostUpvoteScalarFieldEnum
    having?: PostUpvoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostUpvoteCountAggregateInputType | true
    _min?: PostUpvoteMinAggregateInputType
    _max?: PostUpvoteMaxAggregateInputType
  }

  export type PostUpvoteGroupByOutputType = {
    id: string
    postId: string
    userId: string
    createdAt: Date
    _count: PostUpvoteCountAggregateOutputType | null
    _min: PostUpvoteMinAggregateOutputType | null
    _max: PostUpvoteMaxAggregateOutputType | null
  }

  type GetPostUpvoteGroupByPayload<T extends PostUpvoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostUpvoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostUpvoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostUpvoteGroupByOutputType[P]>
            : GetScalarType<T[P], PostUpvoteGroupByOutputType[P]>
        }
      >
    >


  export type PostUpvoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postUpvote"]>

  export type PostUpvoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postUpvote"]>

  export type PostUpvoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postUpvote"]>

  export type PostUpvoteSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type PostUpvoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "postId" | "userId" | "createdAt", ExtArgs["result"]["postUpvote"]>
  export type PostUpvoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PostUpvoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PostUpvoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PostUpvotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PostUpvote"
    objects: {
      post: Prisma.$CreatePostPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      postId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["postUpvote"]>
    composites: {}
  }

  type PostUpvoteGetPayload<S extends boolean | null | undefined | PostUpvoteDefaultArgs> = $Result.GetResult<Prisma.$PostUpvotePayload, S>

  type PostUpvoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostUpvoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostUpvoteCountAggregateInputType | true
    }

  export interface PostUpvoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PostUpvote'], meta: { name: 'PostUpvote' } }
    /**
     * Find zero or one PostUpvote that matches the filter.
     * @param {PostUpvoteFindUniqueArgs} args - Arguments to find a PostUpvote
     * @example
     * // Get one PostUpvote
     * const postUpvote = await prisma.postUpvote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostUpvoteFindUniqueArgs>(args: SelectSubset<T, PostUpvoteFindUniqueArgs<ExtArgs>>): Prisma__PostUpvoteClient<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PostUpvote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostUpvoteFindUniqueOrThrowArgs} args - Arguments to find a PostUpvote
     * @example
     * // Get one PostUpvote
     * const postUpvote = await prisma.postUpvote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostUpvoteFindUniqueOrThrowArgs>(args: SelectSubset<T, PostUpvoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostUpvoteClient<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PostUpvote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpvoteFindFirstArgs} args - Arguments to find a PostUpvote
     * @example
     * // Get one PostUpvote
     * const postUpvote = await prisma.postUpvote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostUpvoteFindFirstArgs>(args?: SelectSubset<T, PostUpvoteFindFirstArgs<ExtArgs>>): Prisma__PostUpvoteClient<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PostUpvote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpvoteFindFirstOrThrowArgs} args - Arguments to find a PostUpvote
     * @example
     * // Get one PostUpvote
     * const postUpvote = await prisma.postUpvote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostUpvoteFindFirstOrThrowArgs>(args?: SelectSubset<T, PostUpvoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostUpvoteClient<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PostUpvotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpvoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PostUpvotes
     * const postUpvotes = await prisma.postUpvote.findMany()
     * 
     * // Get first 10 PostUpvotes
     * const postUpvotes = await prisma.postUpvote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postUpvoteWithIdOnly = await prisma.postUpvote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostUpvoteFindManyArgs>(args?: SelectSubset<T, PostUpvoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PostUpvote.
     * @param {PostUpvoteCreateArgs} args - Arguments to create a PostUpvote.
     * @example
     * // Create one PostUpvote
     * const PostUpvote = await prisma.postUpvote.create({
     *   data: {
     *     // ... data to create a PostUpvote
     *   }
     * })
     * 
     */
    create<T extends PostUpvoteCreateArgs>(args: SelectSubset<T, PostUpvoteCreateArgs<ExtArgs>>): Prisma__PostUpvoteClient<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PostUpvotes.
     * @param {PostUpvoteCreateManyArgs} args - Arguments to create many PostUpvotes.
     * @example
     * // Create many PostUpvotes
     * const postUpvote = await prisma.postUpvote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostUpvoteCreateManyArgs>(args?: SelectSubset<T, PostUpvoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PostUpvotes and returns the data saved in the database.
     * @param {PostUpvoteCreateManyAndReturnArgs} args - Arguments to create many PostUpvotes.
     * @example
     * // Create many PostUpvotes
     * const postUpvote = await prisma.postUpvote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PostUpvotes and only return the `id`
     * const postUpvoteWithIdOnly = await prisma.postUpvote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostUpvoteCreateManyAndReturnArgs>(args?: SelectSubset<T, PostUpvoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PostUpvote.
     * @param {PostUpvoteDeleteArgs} args - Arguments to delete one PostUpvote.
     * @example
     * // Delete one PostUpvote
     * const PostUpvote = await prisma.postUpvote.delete({
     *   where: {
     *     // ... filter to delete one PostUpvote
     *   }
     * })
     * 
     */
    delete<T extends PostUpvoteDeleteArgs>(args: SelectSubset<T, PostUpvoteDeleteArgs<ExtArgs>>): Prisma__PostUpvoteClient<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PostUpvote.
     * @param {PostUpvoteUpdateArgs} args - Arguments to update one PostUpvote.
     * @example
     * // Update one PostUpvote
     * const postUpvote = await prisma.postUpvote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpvoteUpdateArgs>(args: SelectSubset<T, PostUpvoteUpdateArgs<ExtArgs>>): Prisma__PostUpvoteClient<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PostUpvotes.
     * @param {PostUpvoteDeleteManyArgs} args - Arguments to filter PostUpvotes to delete.
     * @example
     * // Delete a few PostUpvotes
     * const { count } = await prisma.postUpvote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostUpvoteDeleteManyArgs>(args?: SelectSubset<T, PostUpvoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PostUpvotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpvoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PostUpvotes
     * const postUpvote = await prisma.postUpvote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpvoteUpdateManyArgs>(args: SelectSubset<T, PostUpvoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PostUpvotes and returns the data updated in the database.
     * @param {PostUpvoteUpdateManyAndReturnArgs} args - Arguments to update many PostUpvotes.
     * @example
     * // Update many PostUpvotes
     * const postUpvote = await prisma.postUpvote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PostUpvotes and only return the `id`
     * const postUpvoteWithIdOnly = await prisma.postUpvote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostUpvoteUpdateManyAndReturnArgs>(args: SelectSubset<T, PostUpvoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PostUpvote.
     * @param {PostUpvoteUpsertArgs} args - Arguments to update or create a PostUpvote.
     * @example
     * // Update or create a PostUpvote
     * const postUpvote = await prisma.postUpvote.upsert({
     *   create: {
     *     // ... data to create a PostUpvote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PostUpvote we want to update
     *   }
     * })
     */
    upsert<T extends PostUpvoteUpsertArgs>(args: SelectSubset<T, PostUpvoteUpsertArgs<ExtArgs>>): Prisma__PostUpvoteClient<$Result.GetResult<Prisma.$PostUpvotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PostUpvotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpvoteCountArgs} args - Arguments to filter PostUpvotes to count.
     * @example
     * // Count the number of PostUpvotes
     * const count = await prisma.postUpvote.count({
     *   where: {
     *     // ... the filter for the PostUpvotes we want to count
     *   }
     * })
    **/
    count<T extends PostUpvoteCountArgs>(
      args?: Subset<T, PostUpvoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostUpvoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PostUpvote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpvoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostUpvoteAggregateArgs>(args: Subset<T, PostUpvoteAggregateArgs>): Prisma.PrismaPromise<GetPostUpvoteAggregateType<T>>

    /**
     * Group by PostUpvote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpvoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostUpvoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostUpvoteGroupByArgs['orderBy'] }
        : { orderBy?: PostUpvoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostUpvoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostUpvoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PostUpvote model
   */
  readonly fields: PostUpvoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PostUpvote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostUpvoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends CreatePostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CreatePostDefaultArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PostUpvote model
   */
  interface PostUpvoteFieldRefs {
    readonly id: FieldRef<"PostUpvote", 'String'>
    readonly postId: FieldRef<"PostUpvote", 'String'>
    readonly userId: FieldRef<"PostUpvote", 'String'>
    readonly createdAt: FieldRef<"PostUpvote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PostUpvote findUnique
   */
  export type PostUpvoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostUpvote to fetch.
     */
    where: PostUpvoteWhereUniqueInput
  }

  /**
   * PostUpvote findUniqueOrThrow
   */
  export type PostUpvoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostUpvote to fetch.
     */
    where: PostUpvoteWhereUniqueInput
  }

  /**
   * PostUpvote findFirst
   */
  export type PostUpvoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostUpvote to fetch.
     */
    where?: PostUpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostUpvotes to fetch.
     */
    orderBy?: PostUpvoteOrderByWithRelationInput | PostUpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PostUpvotes.
     */
    cursor?: PostUpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostUpvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostUpvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PostUpvotes.
     */
    distinct?: PostUpvoteScalarFieldEnum | PostUpvoteScalarFieldEnum[]
  }

  /**
   * PostUpvote findFirstOrThrow
   */
  export type PostUpvoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostUpvote to fetch.
     */
    where?: PostUpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostUpvotes to fetch.
     */
    orderBy?: PostUpvoteOrderByWithRelationInput | PostUpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PostUpvotes.
     */
    cursor?: PostUpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostUpvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostUpvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PostUpvotes.
     */
    distinct?: PostUpvoteScalarFieldEnum | PostUpvoteScalarFieldEnum[]
  }

  /**
   * PostUpvote findMany
   */
  export type PostUpvoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostUpvotes to fetch.
     */
    where?: PostUpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostUpvotes to fetch.
     */
    orderBy?: PostUpvoteOrderByWithRelationInput | PostUpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PostUpvotes.
     */
    cursor?: PostUpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostUpvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostUpvotes.
     */
    skip?: number
    distinct?: PostUpvoteScalarFieldEnum | PostUpvoteScalarFieldEnum[]
  }

  /**
   * PostUpvote create
   */
  export type PostUpvoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * The data needed to create a PostUpvote.
     */
    data: XOR<PostUpvoteCreateInput, PostUpvoteUncheckedCreateInput>
  }

  /**
   * PostUpvote createMany
   */
  export type PostUpvoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PostUpvotes.
     */
    data: PostUpvoteCreateManyInput | PostUpvoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PostUpvote createManyAndReturn
   */
  export type PostUpvoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * The data used to create many PostUpvotes.
     */
    data: PostUpvoteCreateManyInput | PostUpvoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PostUpvote update
   */
  export type PostUpvoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * The data needed to update a PostUpvote.
     */
    data: XOR<PostUpvoteUpdateInput, PostUpvoteUncheckedUpdateInput>
    /**
     * Choose, which PostUpvote to update.
     */
    where: PostUpvoteWhereUniqueInput
  }

  /**
   * PostUpvote updateMany
   */
  export type PostUpvoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PostUpvotes.
     */
    data: XOR<PostUpvoteUpdateManyMutationInput, PostUpvoteUncheckedUpdateManyInput>
    /**
     * Filter which PostUpvotes to update
     */
    where?: PostUpvoteWhereInput
    /**
     * Limit how many PostUpvotes to update.
     */
    limit?: number
  }

  /**
   * PostUpvote updateManyAndReturn
   */
  export type PostUpvoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * The data used to update PostUpvotes.
     */
    data: XOR<PostUpvoteUpdateManyMutationInput, PostUpvoteUncheckedUpdateManyInput>
    /**
     * Filter which PostUpvotes to update
     */
    where?: PostUpvoteWhereInput
    /**
     * Limit how many PostUpvotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PostUpvote upsert
   */
  export type PostUpvoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * The filter to search for the PostUpvote to update in case it exists.
     */
    where: PostUpvoteWhereUniqueInput
    /**
     * In case the PostUpvote found by the `where` argument doesn't exist, create a new PostUpvote with this data.
     */
    create: XOR<PostUpvoteCreateInput, PostUpvoteUncheckedCreateInput>
    /**
     * In case the PostUpvote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpvoteUpdateInput, PostUpvoteUncheckedUpdateInput>
  }

  /**
   * PostUpvote delete
   */
  export type PostUpvoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
    /**
     * Filter which PostUpvote to delete.
     */
    where: PostUpvoteWhereUniqueInput
  }

  /**
   * PostUpvote deleteMany
   */
  export type PostUpvoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PostUpvotes to delete
     */
    where?: PostUpvoteWhereInput
    /**
     * Limit how many PostUpvotes to delete.
     */
    limit?: number
  }

  /**
   * PostUpvote without action
   */
  export type PostUpvoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostUpvote
     */
    select?: PostUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostUpvote
     */
    omit?: PostUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostUpvoteInclude<ExtArgs> | null
  }


  /**
   * Model PostDownvote
   */

  export type AggregatePostDownvote = {
    _count: PostDownvoteCountAggregateOutputType | null
    _min: PostDownvoteMinAggregateOutputType | null
    _max: PostDownvoteMaxAggregateOutputType | null
  }

  export type PostDownvoteMinAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type PostDownvoteMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type PostDownvoteCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type PostDownvoteMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
  }

  export type PostDownvoteMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
  }

  export type PostDownvoteCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type PostDownvoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PostDownvote to aggregate.
     */
    where?: PostDownvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostDownvotes to fetch.
     */
    orderBy?: PostDownvoteOrderByWithRelationInput | PostDownvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostDownvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostDownvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostDownvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PostDownvotes
    **/
    _count?: true | PostDownvoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostDownvoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostDownvoteMaxAggregateInputType
  }

  export type GetPostDownvoteAggregateType<T extends PostDownvoteAggregateArgs> = {
        [P in keyof T & keyof AggregatePostDownvote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePostDownvote[P]>
      : GetScalarType<T[P], AggregatePostDownvote[P]>
  }




  export type PostDownvoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostDownvoteWhereInput
    orderBy?: PostDownvoteOrderByWithAggregationInput | PostDownvoteOrderByWithAggregationInput[]
    by: PostDownvoteScalarFieldEnum[] | PostDownvoteScalarFieldEnum
    having?: PostDownvoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostDownvoteCountAggregateInputType | true
    _min?: PostDownvoteMinAggregateInputType
    _max?: PostDownvoteMaxAggregateInputType
  }

  export type PostDownvoteGroupByOutputType = {
    id: string
    postId: string
    userId: string
    createdAt: Date
    _count: PostDownvoteCountAggregateOutputType | null
    _min: PostDownvoteMinAggregateOutputType | null
    _max: PostDownvoteMaxAggregateOutputType | null
  }

  type GetPostDownvoteGroupByPayload<T extends PostDownvoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostDownvoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostDownvoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostDownvoteGroupByOutputType[P]>
            : GetScalarType<T[P], PostDownvoteGroupByOutputType[P]>
        }
      >
    >


  export type PostDownvoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postDownvote"]>

  export type PostDownvoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postDownvote"]>

  export type PostDownvoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postDownvote"]>

  export type PostDownvoteSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type PostDownvoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "postId" | "userId" | "createdAt", ExtArgs["result"]["postDownvote"]>
  export type PostDownvoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PostDownvoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PostDownvoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CreatePostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PostDownvotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PostDownvote"
    objects: {
      post: Prisma.$CreatePostPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      postId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["postDownvote"]>
    composites: {}
  }

  type PostDownvoteGetPayload<S extends boolean | null | undefined | PostDownvoteDefaultArgs> = $Result.GetResult<Prisma.$PostDownvotePayload, S>

  type PostDownvoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostDownvoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostDownvoteCountAggregateInputType | true
    }

  export interface PostDownvoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PostDownvote'], meta: { name: 'PostDownvote' } }
    /**
     * Find zero or one PostDownvote that matches the filter.
     * @param {PostDownvoteFindUniqueArgs} args - Arguments to find a PostDownvote
     * @example
     * // Get one PostDownvote
     * const postDownvote = await prisma.postDownvote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostDownvoteFindUniqueArgs>(args: SelectSubset<T, PostDownvoteFindUniqueArgs<ExtArgs>>): Prisma__PostDownvoteClient<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PostDownvote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostDownvoteFindUniqueOrThrowArgs} args - Arguments to find a PostDownvote
     * @example
     * // Get one PostDownvote
     * const postDownvote = await prisma.postDownvote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostDownvoteFindUniqueOrThrowArgs>(args: SelectSubset<T, PostDownvoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostDownvoteClient<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PostDownvote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostDownvoteFindFirstArgs} args - Arguments to find a PostDownvote
     * @example
     * // Get one PostDownvote
     * const postDownvote = await prisma.postDownvote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostDownvoteFindFirstArgs>(args?: SelectSubset<T, PostDownvoteFindFirstArgs<ExtArgs>>): Prisma__PostDownvoteClient<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PostDownvote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostDownvoteFindFirstOrThrowArgs} args - Arguments to find a PostDownvote
     * @example
     * // Get one PostDownvote
     * const postDownvote = await prisma.postDownvote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostDownvoteFindFirstOrThrowArgs>(args?: SelectSubset<T, PostDownvoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostDownvoteClient<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PostDownvotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostDownvoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PostDownvotes
     * const postDownvotes = await prisma.postDownvote.findMany()
     * 
     * // Get first 10 PostDownvotes
     * const postDownvotes = await prisma.postDownvote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postDownvoteWithIdOnly = await prisma.postDownvote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostDownvoteFindManyArgs>(args?: SelectSubset<T, PostDownvoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PostDownvote.
     * @param {PostDownvoteCreateArgs} args - Arguments to create a PostDownvote.
     * @example
     * // Create one PostDownvote
     * const PostDownvote = await prisma.postDownvote.create({
     *   data: {
     *     // ... data to create a PostDownvote
     *   }
     * })
     * 
     */
    create<T extends PostDownvoteCreateArgs>(args: SelectSubset<T, PostDownvoteCreateArgs<ExtArgs>>): Prisma__PostDownvoteClient<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PostDownvotes.
     * @param {PostDownvoteCreateManyArgs} args - Arguments to create many PostDownvotes.
     * @example
     * // Create many PostDownvotes
     * const postDownvote = await prisma.postDownvote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostDownvoteCreateManyArgs>(args?: SelectSubset<T, PostDownvoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PostDownvotes and returns the data saved in the database.
     * @param {PostDownvoteCreateManyAndReturnArgs} args - Arguments to create many PostDownvotes.
     * @example
     * // Create many PostDownvotes
     * const postDownvote = await prisma.postDownvote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PostDownvotes and only return the `id`
     * const postDownvoteWithIdOnly = await prisma.postDownvote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostDownvoteCreateManyAndReturnArgs>(args?: SelectSubset<T, PostDownvoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PostDownvote.
     * @param {PostDownvoteDeleteArgs} args - Arguments to delete one PostDownvote.
     * @example
     * // Delete one PostDownvote
     * const PostDownvote = await prisma.postDownvote.delete({
     *   where: {
     *     // ... filter to delete one PostDownvote
     *   }
     * })
     * 
     */
    delete<T extends PostDownvoteDeleteArgs>(args: SelectSubset<T, PostDownvoteDeleteArgs<ExtArgs>>): Prisma__PostDownvoteClient<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PostDownvote.
     * @param {PostDownvoteUpdateArgs} args - Arguments to update one PostDownvote.
     * @example
     * // Update one PostDownvote
     * const postDownvote = await prisma.postDownvote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostDownvoteUpdateArgs>(args: SelectSubset<T, PostDownvoteUpdateArgs<ExtArgs>>): Prisma__PostDownvoteClient<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PostDownvotes.
     * @param {PostDownvoteDeleteManyArgs} args - Arguments to filter PostDownvotes to delete.
     * @example
     * // Delete a few PostDownvotes
     * const { count } = await prisma.postDownvote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDownvoteDeleteManyArgs>(args?: SelectSubset<T, PostDownvoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PostDownvotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostDownvoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PostDownvotes
     * const postDownvote = await prisma.postDownvote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostDownvoteUpdateManyArgs>(args: SelectSubset<T, PostDownvoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PostDownvotes and returns the data updated in the database.
     * @param {PostDownvoteUpdateManyAndReturnArgs} args - Arguments to update many PostDownvotes.
     * @example
     * // Update many PostDownvotes
     * const postDownvote = await prisma.postDownvote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PostDownvotes and only return the `id`
     * const postDownvoteWithIdOnly = await prisma.postDownvote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostDownvoteUpdateManyAndReturnArgs>(args: SelectSubset<T, PostDownvoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PostDownvote.
     * @param {PostDownvoteUpsertArgs} args - Arguments to update or create a PostDownvote.
     * @example
     * // Update or create a PostDownvote
     * const postDownvote = await prisma.postDownvote.upsert({
     *   create: {
     *     // ... data to create a PostDownvote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PostDownvote we want to update
     *   }
     * })
     */
    upsert<T extends PostDownvoteUpsertArgs>(args: SelectSubset<T, PostDownvoteUpsertArgs<ExtArgs>>): Prisma__PostDownvoteClient<$Result.GetResult<Prisma.$PostDownvotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PostDownvotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostDownvoteCountArgs} args - Arguments to filter PostDownvotes to count.
     * @example
     * // Count the number of PostDownvotes
     * const count = await prisma.postDownvote.count({
     *   where: {
     *     // ... the filter for the PostDownvotes we want to count
     *   }
     * })
    **/
    count<T extends PostDownvoteCountArgs>(
      args?: Subset<T, PostDownvoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostDownvoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PostDownvote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostDownvoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostDownvoteAggregateArgs>(args: Subset<T, PostDownvoteAggregateArgs>): Prisma.PrismaPromise<GetPostDownvoteAggregateType<T>>

    /**
     * Group by PostDownvote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostDownvoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostDownvoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostDownvoteGroupByArgs['orderBy'] }
        : { orderBy?: PostDownvoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostDownvoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostDownvoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PostDownvote model
   */
  readonly fields: PostDownvoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PostDownvote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostDownvoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends CreatePostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CreatePostDefaultArgs<ExtArgs>>): Prisma__CreatePostClient<$Result.GetResult<Prisma.$CreatePostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PostDownvote model
   */
  interface PostDownvoteFieldRefs {
    readonly id: FieldRef<"PostDownvote", 'String'>
    readonly postId: FieldRef<"PostDownvote", 'String'>
    readonly userId: FieldRef<"PostDownvote", 'String'>
    readonly createdAt: FieldRef<"PostDownvote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PostDownvote findUnique
   */
  export type PostDownvoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostDownvote to fetch.
     */
    where: PostDownvoteWhereUniqueInput
  }

  /**
   * PostDownvote findUniqueOrThrow
   */
  export type PostDownvoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostDownvote to fetch.
     */
    where: PostDownvoteWhereUniqueInput
  }

  /**
   * PostDownvote findFirst
   */
  export type PostDownvoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostDownvote to fetch.
     */
    where?: PostDownvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostDownvotes to fetch.
     */
    orderBy?: PostDownvoteOrderByWithRelationInput | PostDownvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PostDownvotes.
     */
    cursor?: PostDownvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostDownvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostDownvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PostDownvotes.
     */
    distinct?: PostDownvoteScalarFieldEnum | PostDownvoteScalarFieldEnum[]
  }

  /**
   * PostDownvote findFirstOrThrow
   */
  export type PostDownvoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostDownvote to fetch.
     */
    where?: PostDownvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostDownvotes to fetch.
     */
    orderBy?: PostDownvoteOrderByWithRelationInput | PostDownvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PostDownvotes.
     */
    cursor?: PostDownvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostDownvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostDownvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PostDownvotes.
     */
    distinct?: PostDownvoteScalarFieldEnum | PostDownvoteScalarFieldEnum[]
  }

  /**
   * PostDownvote findMany
   */
  export type PostDownvoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * Filter, which PostDownvotes to fetch.
     */
    where?: PostDownvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostDownvotes to fetch.
     */
    orderBy?: PostDownvoteOrderByWithRelationInput | PostDownvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PostDownvotes.
     */
    cursor?: PostDownvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostDownvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostDownvotes.
     */
    skip?: number
    distinct?: PostDownvoteScalarFieldEnum | PostDownvoteScalarFieldEnum[]
  }

  /**
   * PostDownvote create
   */
  export type PostDownvoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * The data needed to create a PostDownvote.
     */
    data: XOR<PostDownvoteCreateInput, PostDownvoteUncheckedCreateInput>
  }

  /**
   * PostDownvote createMany
   */
  export type PostDownvoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PostDownvotes.
     */
    data: PostDownvoteCreateManyInput | PostDownvoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PostDownvote createManyAndReturn
   */
  export type PostDownvoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * The data used to create many PostDownvotes.
     */
    data: PostDownvoteCreateManyInput | PostDownvoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PostDownvote update
   */
  export type PostDownvoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * The data needed to update a PostDownvote.
     */
    data: XOR<PostDownvoteUpdateInput, PostDownvoteUncheckedUpdateInput>
    /**
     * Choose, which PostDownvote to update.
     */
    where: PostDownvoteWhereUniqueInput
  }

  /**
   * PostDownvote updateMany
   */
  export type PostDownvoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PostDownvotes.
     */
    data: XOR<PostDownvoteUpdateManyMutationInput, PostDownvoteUncheckedUpdateManyInput>
    /**
     * Filter which PostDownvotes to update
     */
    where?: PostDownvoteWhereInput
    /**
     * Limit how many PostDownvotes to update.
     */
    limit?: number
  }

  /**
   * PostDownvote updateManyAndReturn
   */
  export type PostDownvoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * The data used to update PostDownvotes.
     */
    data: XOR<PostDownvoteUpdateManyMutationInput, PostDownvoteUncheckedUpdateManyInput>
    /**
     * Filter which PostDownvotes to update
     */
    where?: PostDownvoteWhereInput
    /**
     * Limit how many PostDownvotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PostDownvote upsert
   */
  export type PostDownvoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * The filter to search for the PostDownvote to update in case it exists.
     */
    where: PostDownvoteWhereUniqueInput
    /**
     * In case the PostDownvote found by the `where` argument doesn't exist, create a new PostDownvote with this data.
     */
    create: XOR<PostDownvoteCreateInput, PostDownvoteUncheckedCreateInput>
    /**
     * In case the PostDownvote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostDownvoteUpdateInput, PostDownvoteUncheckedUpdateInput>
  }

  /**
   * PostDownvote delete
   */
  export type PostDownvoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
    /**
     * Filter which PostDownvote to delete.
     */
    where: PostDownvoteWhereUniqueInput
  }

  /**
   * PostDownvote deleteMany
   */
  export type PostDownvoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PostDownvotes to delete
     */
    where?: PostDownvoteWhereInput
    /**
     * Limit how many PostDownvotes to delete.
     */
    limit?: number
  }

  /**
   * PostDownvote without action
   */
  export type PostDownvoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostDownvote
     */
    select?: PostDownvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostDownvote
     */
    omit?: PostDownvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostDownvoteInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    clerkId: 'clerkId',
    email: 'email',
    collegeName: 'collegeName',
    name: 'name',
    profileAvatar: 'profileAvatar',
    password: 'password',
    createdAt: 'createdAt',
    vToken: 'vToken',
    expiryToken: 'expiryToken',
    ValidFor: 'ValidFor',
    isVerified: 'isVerified',
    clubName: 'clubName',
    clubId: 'clubId',
    bio: 'bio',
    tags: 'tags',
    course: 'course',
    year: 'year',
    phone: 'phone',
    twitter: 'twitter',
    linkedin: 'linkedin',
    instagram: 'instagram'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ClubsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    founderEmail: 'founderEmail',
    coremember1: 'coremember1',
    coremember2: 'coremember2',
    coremember3: 'coremember3',
    facultyEmail: 'facultyEmail',
    collegeName: 'collegeName',
    collegeId: 'collegeId',
    type: 'type',
    description: 'description',
    requirements: 'requirements',
    profilePicUrl: 'profilePicUrl',
    clubContact: 'clubContact',
    wings: 'wings',
    instagram: 'instagram',
    twitter: 'twitter',
    linkedin: 'linkedin'
  };

  export type ClubsScalarFieldEnum = (typeof ClubsScalarFieldEnum)[keyof typeof ClubsScalarFieldEnum]


  export const CreatePostScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    published: 'published',
    collegeName: 'collegeName',
    clubName: 'clubName',
    collegeId: 'collegeId',
    authorId: 'authorId'
  };

  export type CreatePostScalarFieldEnum = (typeof CreatePostScalarFieldEnum)[keyof typeof CreatePostScalarFieldEnum]


  export const SpeakersScalarFieldEnum: {
    id: 'id',
    profilePic: 'profilePic',
    about: 'about',
    name: 'name',
    email: 'email',
    eventId: 'eventId'
  };

  export type SpeakersScalarFieldEnum = (typeof SpeakersScalarFieldEnum)[keyof typeof SpeakersScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    posterUrl: 'posterUrl',
    EventMode: 'EventMode',
    EventType: 'EventType',
    eventHeaderImage: 'eventHeaderImage',
    EventName: 'EventName',
    description: 'description',
    tagline: 'tagline',
    prizes: 'prizes',
    TeamSize: 'TeamSize',
    Venue: 'Venue',
    EventUrl: 'EventUrl',
    applicationStatus: 'applicationStatus',
    applicationStartDate: 'applicationStartDate',
    applicationEndDate: 'applicationEndDate',
    clubName: 'clubName',
    clubId: 'clubId',
    university: 'university',
    createdAt: 'createdAt',
    startDate: 'startDate',
    endDate: 'endDate',
    collegeStudentsOnly: 'collegeStudentsOnly',
    participationFee: 'participationFee',
    contactEmail: 'contactEmail',
    contactPhone: 'contactPhone',
    Form: 'Form',
    Fees: 'Fees',
    link1: 'link1',
    link2: 'link2',
    link3: 'link3',
    whatsappLink: 'whatsappLink',
    isPaid: 'isPaid',
    qrCodeUrl: 'qrCodeUrl'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const EventAnnouncementScalarFieldEnum: {
    id: 'id',
    Title: 'Title',
    Description: 'Description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    eventId: 'eventId'
  };

  export type EventAnnouncementScalarFieldEnum = (typeof EventAnnouncementScalarFieldEnum)[keyof typeof EventAnnouncementScalarFieldEnum]


  export const EventGalleryScalarFieldEnum: {
    id: 'id',
    imageUrl: 'imageUrl',
    caption: 'caption',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    eventId: 'eventId'
  };

  export type EventGalleryScalarFieldEnum = (typeof EventGalleryScalarFieldEnum)[keyof typeof EventGalleryScalarFieldEnum]


  export const ClubAnnouncementScalarFieldEnum: {
    id: 'id',
    Title: 'Title',
    Description: 'Description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    clubId: 'clubId'
  };

  export type ClubAnnouncementScalarFieldEnum = (typeof ClubAnnouncementScalarFieldEnum)[keyof typeof ClubAnnouncementScalarFieldEnum]


  export const UserEventsScalarFieldEnum: {
    userId: 'userId',
    eventId: 'eventId',
    uniquePassId: 'uniquePassId',
    joinedAt: 'joinedAt',
    paymentScreenshotUrl: 'paymentScreenshotUrl',
    paymentStatus: 'paymentStatus',
    paymentVerifiedAt: 'paymentVerifiedAt'
  };

  export type UserEventsScalarFieldEnum = (typeof UserEventsScalarFieldEnum)[keyof typeof UserEventsScalarFieldEnum]


  export const PostUpvoteScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type PostUpvoteScalarFieldEnum = (typeof PostUpvoteScalarFieldEnum)[keyof typeof PostUpvoteScalarFieldEnum]


  export const PostDownvoteScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type PostDownvoteScalarFieldEnum = (typeof PostDownvoteScalarFieldEnum)[keyof typeof PostDownvoteScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    clerkId?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    collegeName?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    profileAvatar?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    vToken?: StringNullableFilter<"User"> | string | null
    expiryToken?: IntNullableFilter<"User"> | number | null
    ValidFor?: IntNullableFilter<"User"> | number | null
    isVerified?: BoolNullableFilter<"User"> | boolean | null
    clubName?: StringNullableFilter<"User"> | string | null
    clubId?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    tags?: StringNullableListFilter<"User">
    course?: StringNullableFilter<"User"> | string | null
    year?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    twitter?: StringNullableFilter<"User"> | string | null
    linkedin?: StringNullableFilter<"User"> | string | null
    instagram?: StringNullableFilter<"User"> | string | null
    eventAttended?: UserEventsListRelationFilter
    club?: XOR<ClubsNullableScalarRelationFilter, clubsWhereInput> | null
    CreatePost?: CreatePostListRelationFilter
    postUpvotes?: PostUpvoteListRelationFilter
    postDownvotes?: PostDownvoteListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    clerkId?: SortOrderInput | SortOrder
    email?: SortOrder
    collegeName?: SortOrder
    name?: SortOrderInput | SortOrder
    profileAvatar?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    vToken?: SortOrderInput | SortOrder
    expiryToken?: SortOrderInput | SortOrder
    ValidFor?: SortOrderInput | SortOrder
    isVerified?: SortOrderInput | SortOrder
    clubName?: SortOrderInput | SortOrder
    clubId?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    tags?: SortOrder
    course?: SortOrderInput | SortOrder
    year?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    twitter?: SortOrderInput | SortOrder
    linkedin?: SortOrderInput | SortOrder
    instagram?: SortOrderInput | SortOrder
    eventAttended?: userEventsOrderByRelationAggregateInput
    club?: clubsOrderByWithRelationInput
    CreatePost?: CreatePostOrderByRelationAggregateInput
    postUpvotes?: PostUpvoteOrderByRelationAggregateInput
    postDownvotes?: PostDownvoteOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clerkId?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    collegeName?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    profileAvatar?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    vToken?: StringNullableFilter<"User"> | string | null
    expiryToken?: IntNullableFilter<"User"> | number | null
    ValidFor?: IntNullableFilter<"User"> | number | null
    isVerified?: BoolNullableFilter<"User"> | boolean | null
    clubName?: StringNullableFilter<"User"> | string | null
    clubId?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    tags?: StringNullableListFilter<"User">
    course?: StringNullableFilter<"User"> | string | null
    year?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    twitter?: StringNullableFilter<"User"> | string | null
    linkedin?: StringNullableFilter<"User"> | string | null
    instagram?: StringNullableFilter<"User"> | string | null
    eventAttended?: UserEventsListRelationFilter
    club?: XOR<ClubsNullableScalarRelationFilter, clubsWhereInput> | null
    CreatePost?: CreatePostListRelationFilter
    postUpvotes?: PostUpvoteListRelationFilter
    postDownvotes?: PostDownvoteListRelationFilter
  }, "id" | "clerkId" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    clerkId?: SortOrderInput | SortOrder
    email?: SortOrder
    collegeName?: SortOrder
    name?: SortOrderInput | SortOrder
    profileAvatar?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    vToken?: SortOrderInput | SortOrder
    expiryToken?: SortOrderInput | SortOrder
    ValidFor?: SortOrderInput | SortOrder
    isVerified?: SortOrderInput | SortOrder
    clubName?: SortOrderInput | SortOrder
    clubId?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    tags?: SortOrder
    course?: SortOrderInput | SortOrder
    year?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    twitter?: SortOrderInput | SortOrder
    linkedin?: SortOrderInput | SortOrder
    instagram?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    clerkId?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    collegeName?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    profileAvatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    vToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    expiryToken?: IntNullableWithAggregatesFilter<"User"> | number | null
    ValidFor?: IntNullableWithAggregatesFilter<"User"> | number | null
    isVerified?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    clubName?: StringNullableWithAggregatesFilter<"User"> | string | null
    clubId?: StringNullableWithAggregatesFilter<"User"> | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    tags?: StringNullableListFilter<"User">
    course?: StringNullableWithAggregatesFilter<"User"> | string | null
    year?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    twitter?: StringNullableWithAggregatesFilter<"User"> | string | null
    linkedin?: StringNullableWithAggregatesFilter<"User"> | string | null
    instagram?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type clubsWhereInput = {
    AND?: clubsWhereInput | clubsWhereInput[]
    OR?: clubsWhereInput[]
    NOT?: clubsWhereInput | clubsWhereInput[]
    id?: StringFilter<"clubs"> | string
    name?: StringFilter<"clubs"> | string
    founderEmail?: StringFilter<"clubs"> | string
    coremember1?: StringNullableFilter<"clubs"> | string | null
    coremember2?: StringNullableFilter<"clubs"> | string | null
    coremember3?: StringNullableFilter<"clubs"> | string | null
    facultyEmail?: StringFilter<"clubs"> | string
    collegeName?: StringFilter<"clubs"> | string
    collegeId?: StringFilter<"clubs"> | string
    type?: StringFilter<"clubs"> | string
    description?: StringFilter<"clubs"> | string
    requirements?: StringNullableFilter<"clubs"> | string | null
    profilePicUrl?: StringNullableFilter<"clubs"> | string | null
    clubContact?: StringFilter<"clubs"> | string
    wings?: StringNullableListFilter<"clubs">
    instagram?: StringNullableFilter<"clubs"> | string | null
    twitter?: StringNullableFilter<"clubs"> | string | null
    linkedin?: StringNullableFilter<"clubs"> | string | null
    posts?: CreatePostListRelationFilter
    members?: UserListRelationFilter
    events?: EventListRelationFilter
    announcements?: ClubAnnouncementListRelationFilter
  }

  export type clubsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    founderEmail?: SortOrder
    coremember1?: SortOrderInput | SortOrder
    coremember2?: SortOrderInput | SortOrder
    coremember3?: SortOrderInput | SortOrder
    facultyEmail?: SortOrder
    collegeName?: SortOrder
    collegeId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    requirements?: SortOrderInput | SortOrder
    profilePicUrl?: SortOrderInput | SortOrder
    clubContact?: SortOrder
    wings?: SortOrder
    instagram?: SortOrderInput | SortOrder
    twitter?: SortOrderInput | SortOrder
    linkedin?: SortOrderInput | SortOrder
    posts?: CreatePostOrderByRelationAggregateInput
    members?: UserOrderByRelationAggregateInput
    events?: eventOrderByRelationAggregateInput
    announcements?: clubAnnouncementOrderByRelationAggregateInput
  }

  export type clubsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    founderEmail?: string
    collegeId?: string
    AND?: clubsWhereInput | clubsWhereInput[]
    OR?: clubsWhereInput[]
    NOT?: clubsWhereInput | clubsWhereInput[]
    name?: StringFilter<"clubs"> | string
    coremember1?: StringNullableFilter<"clubs"> | string | null
    coremember2?: StringNullableFilter<"clubs"> | string | null
    coremember3?: StringNullableFilter<"clubs"> | string | null
    facultyEmail?: StringFilter<"clubs"> | string
    collegeName?: StringFilter<"clubs"> | string
    type?: StringFilter<"clubs"> | string
    description?: StringFilter<"clubs"> | string
    requirements?: StringNullableFilter<"clubs"> | string | null
    profilePicUrl?: StringNullableFilter<"clubs"> | string | null
    clubContact?: StringFilter<"clubs"> | string
    wings?: StringNullableListFilter<"clubs">
    instagram?: StringNullableFilter<"clubs"> | string | null
    twitter?: StringNullableFilter<"clubs"> | string | null
    linkedin?: StringNullableFilter<"clubs"> | string | null
    posts?: CreatePostListRelationFilter
    members?: UserListRelationFilter
    events?: EventListRelationFilter
    announcements?: ClubAnnouncementListRelationFilter
  }, "id" | "founderEmail" | "collegeId">

  export type clubsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    founderEmail?: SortOrder
    coremember1?: SortOrderInput | SortOrder
    coremember2?: SortOrderInput | SortOrder
    coremember3?: SortOrderInput | SortOrder
    facultyEmail?: SortOrder
    collegeName?: SortOrder
    collegeId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    requirements?: SortOrderInput | SortOrder
    profilePicUrl?: SortOrderInput | SortOrder
    clubContact?: SortOrder
    wings?: SortOrder
    instagram?: SortOrderInput | SortOrder
    twitter?: SortOrderInput | SortOrder
    linkedin?: SortOrderInput | SortOrder
    _count?: clubsCountOrderByAggregateInput
    _max?: clubsMaxOrderByAggregateInput
    _min?: clubsMinOrderByAggregateInput
  }

  export type clubsScalarWhereWithAggregatesInput = {
    AND?: clubsScalarWhereWithAggregatesInput | clubsScalarWhereWithAggregatesInput[]
    OR?: clubsScalarWhereWithAggregatesInput[]
    NOT?: clubsScalarWhereWithAggregatesInput | clubsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"clubs"> | string
    name?: StringWithAggregatesFilter<"clubs"> | string
    founderEmail?: StringWithAggregatesFilter<"clubs"> | string
    coremember1?: StringNullableWithAggregatesFilter<"clubs"> | string | null
    coremember2?: StringNullableWithAggregatesFilter<"clubs"> | string | null
    coremember3?: StringNullableWithAggregatesFilter<"clubs"> | string | null
    facultyEmail?: StringWithAggregatesFilter<"clubs"> | string
    collegeName?: StringWithAggregatesFilter<"clubs"> | string
    collegeId?: StringWithAggregatesFilter<"clubs"> | string
    type?: StringWithAggregatesFilter<"clubs"> | string
    description?: StringWithAggregatesFilter<"clubs"> | string
    requirements?: StringNullableWithAggregatesFilter<"clubs"> | string | null
    profilePicUrl?: StringNullableWithAggregatesFilter<"clubs"> | string | null
    clubContact?: StringWithAggregatesFilter<"clubs"> | string
    wings?: StringNullableListFilter<"clubs">
    instagram?: StringNullableWithAggregatesFilter<"clubs"> | string | null
    twitter?: StringNullableWithAggregatesFilter<"clubs"> | string | null
    linkedin?: StringNullableWithAggregatesFilter<"clubs"> | string | null
  }

  export type CreatePostWhereInput = {
    AND?: CreatePostWhereInput | CreatePostWhereInput[]
    OR?: CreatePostWhereInput[]
    NOT?: CreatePostWhereInput | CreatePostWhereInput[]
    id?: StringFilter<"CreatePost"> | string
    title?: StringFilter<"CreatePost"> | string
    description?: StringFilter<"CreatePost"> | string
    image?: StringNullableFilter<"CreatePost"> | string | null
    createdAt?: DateTimeFilter<"CreatePost"> | Date | string
    updatedAt?: DateTimeFilter<"CreatePost"> | Date | string
    published?: BoolFilter<"CreatePost"> | boolean
    collegeName?: StringFilter<"CreatePost"> | string
    clubName?: StringFilter<"CreatePost"> | string
    collegeId?: StringNullableFilter<"CreatePost"> | string | null
    authorId?: StringFilter<"CreatePost"> | string
    club?: XOR<ClubsNullableScalarRelationFilter, clubsWhereInput> | null
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    upvotes?: PostUpvoteListRelationFilter
    downvotes?: PostDownvoteListRelationFilter
  }

  export type CreatePostOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    published?: SortOrder
    collegeName?: SortOrder
    clubName?: SortOrder
    collegeId?: SortOrderInput | SortOrder
    authorId?: SortOrder
    club?: clubsOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
    upvotes?: PostUpvoteOrderByRelationAggregateInput
    downvotes?: PostDownvoteOrderByRelationAggregateInput
  }

  export type CreatePostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CreatePostWhereInput | CreatePostWhereInput[]
    OR?: CreatePostWhereInput[]
    NOT?: CreatePostWhereInput | CreatePostWhereInput[]
    title?: StringFilter<"CreatePost"> | string
    description?: StringFilter<"CreatePost"> | string
    image?: StringNullableFilter<"CreatePost"> | string | null
    createdAt?: DateTimeFilter<"CreatePost"> | Date | string
    updatedAt?: DateTimeFilter<"CreatePost"> | Date | string
    published?: BoolFilter<"CreatePost"> | boolean
    collegeName?: StringFilter<"CreatePost"> | string
    clubName?: StringFilter<"CreatePost"> | string
    collegeId?: StringNullableFilter<"CreatePost"> | string | null
    authorId?: StringFilter<"CreatePost"> | string
    club?: XOR<ClubsNullableScalarRelationFilter, clubsWhereInput> | null
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    upvotes?: PostUpvoteListRelationFilter
    downvotes?: PostDownvoteListRelationFilter
  }, "id">

  export type CreatePostOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    published?: SortOrder
    collegeName?: SortOrder
    clubName?: SortOrder
    collegeId?: SortOrderInput | SortOrder
    authorId?: SortOrder
    _count?: CreatePostCountOrderByAggregateInput
    _max?: CreatePostMaxOrderByAggregateInput
    _min?: CreatePostMinOrderByAggregateInput
  }

  export type CreatePostScalarWhereWithAggregatesInput = {
    AND?: CreatePostScalarWhereWithAggregatesInput | CreatePostScalarWhereWithAggregatesInput[]
    OR?: CreatePostScalarWhereWithAggregatesInput[]
    NOT?: CreatePostScalarWhereWithAggregatesInput | CreatePostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CreatePost"> | string
    title?: StringWithAggregatesFilter<"CreatePost"> | string
    description?: StringWithAggregatesFilter<"CreatePost"> | string
    image?: StringNullableWithAggregatesFilter<"CreatePost"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CreatePost"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CreatePost"> | Date | string
    published?: BoolWithAggregatesFilter<"CreatePost"> | boolean
    collegeName?: StringWithAggregatesFilter<"CreatePost"> | string
    clubName?: StringWithAggregatesFilter<"CreatePost"> | string
    collegeId?: StringNullableWithAggregatesFilter<"CreatePost"> | string | null
    authorId?: StringWithAggregatesFilter<"CreatePost"> | string
  }

  export type speakersWhereInput = {
    AND?: speakersWhereInput | speakersWhereInput[]
    OR?: speakersWhereInput[]
    NOT?: speakersWhereInput | speakersWhereInput[]
    id?: IntFilter<"speakers"> | number
    profilePic?: StringNullableFilter<"speakers"> | string | null
    about?: StringFilter<"speakers"> | string
    name?: StringFilter<"speakers"> | string
    email?: StringFilter<"speakers"> | string
    eventId?: StringFilter<"speakers"> | string
    event?: XOR<EventScalarRelationFilter, eventWhereInput>
  }

  export type speakersOrderByWithRelationInput = {
    id?: SortOrder
    profilePic?: SortOrderInput | SortOrder
    about?: SortOrder
    name?: SortOrder
    email?: SortOrder
    eventId?: SortOrder
    event?: eventOrderByWithRelationInput
  }

  export type speakersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: speakersWhereInput | speakersWhereInput[]
    OR?: speakersWhereInput[]
    NOT?: speakersWhereInput | speakersWhereInput[]
    profilePic?: StringNullableFilter<"speakers"> | string | null
    about?: StringFilter<"speakers"> | string
    name?: StringFilter<"speakers"> | string
    eventId?: StringFilter<"speakers"> | string
    event?: XOR<EventScalarRelationFilter, eventWhereInput>
  }, "id" | "email">

  export type speakersOrderByWithAggregationInput = {
    id?: SortOrder
    profilePic?: SortOrderInput | SortOrder
    about?: SortOrder
    name?: SortOrder
    email?: SortOrder
    eventId?: SortOrder
    _count?: speakersCountOrderByAggregateInput
    _avg?: speakersAvgOrderByAggregateInput
    _max?: speakersMaxOrderByAggregateInput
    _min?: speakersMinOrderByAggregateInput
    _sum?: speakersSumOrderByAggregateInput
  }

  export type speakersScalarWhereWithAggregatesInput = {
    AND?: speakersScalarWhereWithAggregatesInput | speakersScalarWhereWithAggregatesInput[]
    OR?: speakersScalarWhereWithAggregatesInput[]
    NOT?: speakersScalarWhereWithAggregatesInput | speakersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"speakers"> | number
    profilePic?: StringNullableWithAggregatesFilter<"speakers"> | string | null
    about?: StringWithAggregatesFilter<"speakers"> | string
    name?: StringWithAggregatesFilter<"speakers"> | string
    email?: StringWithAggregatesFilter<"speakers"> | string
    eventId?: StringWithAggregatesFilter<"speakers"> | string
  }

  export type eventWhereInput = {
    AND?: eventWhereInput | eventWhereInput[]
    OR?: eventWhereInput[]
    NOT?: eventWhereInput | eventWhereInput[]
    id?: StringFilter<"event"> | string
    posterUrl?: StringNullableFilter<"event"> | string | null
    EventMode?: StringFilter<"event"> | string
    EventType?: StringFilter<"event"> | string
    eventHeaderImage?: StringNullableFilter<"event"> | string | null
    EventName?: StringFilter<"event"> | string
    description?: StringFilter<"event"> | string
    tagline?: StringNullableFilter<"event"> | string | null
    prizes?: StringFilter<"event"> | string
    TeamSize?: IntFilter<"event"> | number
    Venue?: StringFilter<"event"> | string
    EventUrl?: StringNullableFilter<"event"> | string | null
    applicationStatus?: StringFilter<"event"> | string
    applicationStartDate?: StringNullableFilter<"event"> | string | null
    applicationEndDate?: StringNullableFilter<"event"> | string | null
    clubName?: StringFilter<"event"> | string
    clubId?: StringFilter<"event"> | string
    university?: StringFilter<"event"> | string
    createdAt?: DateTimeFilter<"event"> | Date | string
    startDate?: StringFilter<"event"> | string
    endDate?: StringNullableFilter<"event"> | string | null
    collegeStudentsOnly?: BoolFilter<"event"> | boolean
    participationFee?: BoolFilter<"event"> | boolean
    contactEmail?: StringFilter<"event"> | string
    contactPhone?: StringNullableFilter<"event"> | string | null
    Form?: StringNullableFilter<"event"> | string | null
    Fees?: StringNullableFilter<"event"> | string | null
    link1?: StringNullableFilter<"event"> | string | null
    link2?: StringNullableFilter<"event"> | string | null
    link3?: StringNullableFilter<"event"> | string | null
    whatsappLink?: StringNullableFilter<"event"> | string | null
    isPaid?: BoolFilter<"event"> | boolean
    qrCodeUrl?: StringNullableFilter<"event"> | string | null
    club?: XOR<ClubsScalarRelationFilter, clubsWhereInput>
    speakers?: SpeakersListRelationFilter
    attendees?: UserEventsListRelationFilter
    announcements?: EventAnnouncementListRelationFilter
    galleries?: EventGalleryListRelationFilter
  }

  export type eventOrderByWithRelationInput = {
    id?: SortOrder
    posterUrl?: SortOrderInput | SortOrder
    EventMode?: SortOrder
    EventType?: SortOrder
    eventHeaderImage?: SortOrderInput | SortOrder
    EventName?: SortOrder
    description?: SortOrder
    tagline?: SortOrderInput | SortOrder
    prizes?: SortOrder
    TeamSize?: SortOrder
    Venue?: SortOrder
    EventUrl?: SortOrderInput | SortOrder
    applicationStatus?: SortOrder
    applicationStartDate?: SortOrderInput | SortOrder
    applicationEndDate?: SortOrderInput | SortOrder
    clubName?: SortOrder
    clubId?: SortOrder
    university?: SortOrder
    createdAt?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    collegeStudentsOnly?: SortOrder
    participationFee?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrderInput | SortOrder
    Form?: SortOrderInput | SortOrder
    Fees?: SortOrderInput | SortOrder
    link1?: SortOrderInput | SortOrder
    link2?: SortOrderInput | SortOrder
    link3?: SortOrderInput | SortOrder
    whatsappLink?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    qrCodeUrl?: SortOrderInput | SortOrder
    club?: clubsOrderByWithRelationInput
    speakers?: speakersOrderByRelationAggregateInput
    attendees?: userEventsOrderByRelationAggregateInput
    announcements?: eventAnnouncementOrderByRelationAggregateInput
    galleries?: eventGalleryOrderByRelationAggregateInput
  }

  export type eventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    EventName?: string
    AND?: eventWhereInput | eventWhereInput[]
    OR?: eventWhereInput[]
    NOT?: eventWhereInput | eventWhereInput[]
    posterUrl?: StringNullableFilter<"event"> | string | null
    EventMode?: StringFilter<"event"> | string
    EventType?: StringFilter<"event"> | string
    eventHeaderImage?: StringNullableFilter<"event"> | string | null
    description?: StringFilter<"event"> | string
    tagline?: StringNullableFilter<"event"> | string | null
    prizes?: StringFilter<"event"> | string
    TeamSize?: IntFilter<"event"> | number
    Venue?: StringFilter<"event"> | string
    EventUrl?: StringNullableFilter<"event"> | string | null
    applicationStatus?: StringFilter<"event"> | string
    applicationStartDate?: StringNullableFilter<"event"> | string | null
    applicationEndDate?: StringNullableFilter<"event"> | string | null
    clubName?: StringFilter<"event"> | string
    clubId?: StringFilter<"event"> | string
    university?: StringFilter<"event"> | string
    createdAt?: DateTimeFilter<"event"> | Date | string
    startDate?: StringFilter<"event"> | string
    endDate?: StringNullableFilter<"event"> | string | null
    collegeStudentsOnly?: BoolFilter<"event"> | boolean
    participationFee?: BoolFilter<"event"> | boolean
    contactEmail?: StringFilter<"event"> | string
    contactPhone?: StringNullableFilter<"event"> | string | null
    Form?: StringNullableFilter<"event"> | string | null
    Fees?: StringNullableFilter<"event"> | string | null
    link1?: StringNullableFilter<"event"> | string | null
    link2?: StringNullableFilter<"event"> | string | null
    link3?: StringNullableFilter<"event"> | string | null
    whatsappLink?: StringNullableFilter<"event"> | string | null
    isPaid?: BoolFilter<"event"> | boolean
    qrCodeUrl?: StringNullableFilter<"event"> | string | null
    club?: XOR<ClubsScalarRelationFilter, clubsWhereInput>
    speakers?: SpeakersListRelationFilter
    attendees?: UserEventsListRelationFilter
    announcements?: EventAnnouncementListRelationFilter
    galleries?: EventGalleryListRelationFilter
  }, "id" | "EventName">

  export type eventOrderByWithAggregationInput = {
    id?: SortOrder
    posterUrl?: SortOrderInput | SortOrder
    EventMode?: SortOrder
    EventType?: SortOrder
    eventHeaderImage?: SortOrderInput | SortOrder
    EventName?: SortOrder
    description?: SortOrder
    tagline?: SortOrderInput | SortOrder
    prizes?: SortOrder
    TeamSize?: SortOrder
    Venue?: SortOrder
    EventUrl?: SortOrderInput | SortOrder
    applicationStatus?: SortOrder
    applicationStartDate?: SortOrderInput | SortOrder
    applicationEndDate?: SortOrderInput | SortOrder
    clubName?: SortOrder
    clubId?: SortOrder
    university?: SortOrder
    createdAt?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    collegeStudentsOnly?: SortOrder
    participationFee?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrderInput | SortOrder
    Form?: SortOrderInput | SortOrder
    Fees?: SortOrderInput | SortOrder
    link1?: SortOrderInput | SortOrder
    link2?: SortOrderInput | SortOrder
    link3?: SortOrderInput | SortOrder
    whatsappLink?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    qrCodeUrl?: SortOrderInput | SortOrder
    _count?: eventCountOrderByAggregateInput
    _avg?: eventAvgOrderByAggregateInput
    _max?: eventMaxOrderByAggregateInput
    _min?: eventMinOrderByAggregateInput
    _sum?: eventSumOrderByAggregateInput
  }

  export type eventScalarWhereWithAggregatesInput = {
    AND?: eventScalarWhereWithAggregatesInput | eventScalarWhereWithAggregatesInput[]
    OR?: eventScalarWhereWithAggregatesInput[]
    NOT?: eventScalarWhereWithAggregatesInput | eventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"event"> | string
    posterUrl?: StringNullableWithAggregatesFilter<"event"> | string | null
    EventMode?: StringWithAggregatesFilter<"event"> | string
    EventType?: StringWithAggregatesFilter<"event"> | string
    eventHeaderImage?: StringNullableWithAggregatesFilter<"event"> | string | null
    EventName?: StringWithAggregatesFilter<"event"> | string
    description?: StringWithAggregatesFilter<"event"> | string
    tagline?: StringNullableWithAggregatesFilter<"event"> | string | null
    prizes?: StringWithAggregatesFilter<"event"> | string
    TeamSize?: IntWithAggregatesFilter<"event"> | number
    Venue?: StringWithAggregatesFilter<"event"> | string
    EventUrl?: StringNullableWithAggregatesFilter<"event"> | string | null
    applicationStatus?: StringWithAggregatesFilter<"event"> | string
    applicationStartDate?: StringNullableWithAggregatesFilter<"event"> | string | null
    applicationEndDate?: StringNullableWithAggregatesFilter<"event"> | string | null
    clubName?: StringWithAggregatesFilter<"event"> | string
    clubId?: StringWithAggregatesFilter<"event"> | string
    university?: StringWithAggregatesFilter<"event"> | string
    createdAt?: DateTimeWithAggregatesFilter<"event"> | Date | string
    startDate?: StringWithAggregatesFilter<"event"> | string
    endDate?: StringNullableWithAggregatesFilter<"event"> | string | null
    collegeStudentsOnly?: BoolWithAggregatesFilter<"event"> | boolean
    participationFee?: BoolWithAggregatesFilter<"event"> | boolean
    contactEmail?: StringWithAggregatesFilter<"event"> | string
    contactPhone?: StringNullableWithAggregatesFilter<"event"> | string | null
    Form?: StringNullableWithAggregatesFilter<"event"> | string | null
    Fees?: StringNullableWithAggregatesFilter<"event"> | string | null
    link1?: StringNullableWithAggregatesFilter<"event"> | string | null
    link2?: StringNullableWithAggregatesFilter<"event"> | string | null
    link3?: StringNullableWithAggregatesFilter<"event"> | string | null
    whatsappLink?: StringNullableWithAggregatesFilter<"event"> | string | null
    isPaid?: BoolWithAggregatesFilter<"event"> | boolean
    qrCodeUrl?: StringNullableWithAggregatesFilter<"event"> | string | null
  }

  export type eventAnnouncementWhereInput = {
    AND?: eventAnnouncementWhereInput | eventAnnouncementWhereInput[]
    OR?: eventAnnouncementWhereInput[]
    NOT?: eventAnnouncementWhereInput | eventAnnouncementWhereInput[]
    id?: StringFilter<"eventAnnouncement"> | string
    Title?: StringFilter<"eventAnnouncement"> | string
    Description?: StringFilter<"eventAnnouncement"> | string
    createdAt?: DateTimeFilter<"eventAnnouncement"> | Date | string
    updatedAt?: DateTimeNullableFilter<"eventAnnouncement"> | Date | string | null
    eventId?: StringFilter<"eventAnnouncement"> | string
    event?: XOR<EventScalarRelationFilter, eventWhereInput>
  }

  export type eventAnnouncementOrderByWithRelationInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    eventId?: SortOrder
    event?: eventOrderByWithRelationInput
  }

  export type eventAnnouncementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: eventAnnouncementWhereInput | eventAnnouncementWhereInput[]
    OR?: eventAnnouncementWhereInput[]
    NOT?: eventAnnouncementWhereInput | eventAnnouncementWhereInput[]
    Title?: StringFilter<"eventAnnouncement"> | string
    Description?: StringFilter<"eventAnnouncement"> | string
    createdAt?: DateTimeFilter<"eventAnnouncement"> | Date | string
    updatedAt?: DateTimeNullableFilter<"eventAnnouncement"> | Date | string | null
    eventId?: StringFilter<"eventAnnouncement"> | string
    event?: XOR<EventScalarRelationFilter, eventWhereInput>
  }, "id">

  export type eventAnnouncementOrderByWithAggregationInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    eventId?: SortOrder
    _count?: eventAnnouncementCountOrderByAggregateInput
    _max?: eventAnnouncementMaxOrderByAggregateInput
    _min?: eventAnnouncementMinOrderByAggregateInput
  }

  export type eventAnnouncementScalarWhereWithAggregatesInput = {
    AND?: eventAnnouncementScalarWhereWithAggregatesInput | eventAnnouncementScalarWhereWithAggregatesInput[]
    OR?: eventAnnouncementScalarWhereWithAggregatesInput[]
    NOT?: eventAnnouncementScalarWhereWithAggregatesInput | eventAnnouncementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"eventAnnouncement"> | string
    Title?: StringWithAggregatesFilter<"eventAnnouncement"> | string
    Description?: StringWithAggregatesFilter<"eventAnnouncement"> | string
    createdAt?: DateTimeWithAggregatesFilter<"eventAnnouncement"> | Date | string
    updatedAt?: DateTimeNullableWithAggregatesFilter<"eventAnnouncement"> | Date | string | null
    eventId?: StringWithAggregatesFilter<"eventAnnouncement"> | string
  }

  export type eventGalleryWhereInput = {
    AND?: eventGalleryWhereInput | eventGalleryWhereInput[]
    OR?: eventGalleryWhereInput[]
    NOT?: eventGalleryWhereInput | eventGalleryWhereInput[]
    id?: StringFilter<"eventGallery"> | string
    imageUrl?: StringFilter<"eventGallery"> | string
    caption?: StringNullableFilter<"eventGallery"> | string | null
    createdAt?: DateTimeFilter<"eventGallery"> | Date | string
    updatedAt?: DateTimeNullableFilter<"eventGallery"> | Date | string | null
    eventId?: StringFilter<"eventGallery"> | string
    event?: XOR<EventScalarRelationFilter, eventWhereInput>
  }

  export type eventGalleryOrderByWithRelationInput = {
    id?: SortOrder
    imageUrl?: SortOrder
    caption?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    eventId?: SortOrder
    event?: eventOrderByWithRelationInput
  }

  export type eventGalleryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: eventGalleryWhereInput | eventGalleryWhereInput[]
    OR?: eventGalleryWhereInput[]
    NOT?: eventGalleryWhereInput | eventGalleryWhereInput[]
    imageUrl?: StringFilter<"eventGallery"> | string
    caption?: StringNullableFilter<"eventGallery"> | string | null
    createdAt?: DateTimeFilter<"eventGallery"> | Date | string
    updatedAt?: DateTimeNullableFilter<"eventGallery"> | Date | string | null
    eventId?: StringFilter<"eventGallery"> | string
    event?: XOR<EventScalarRelationFilter, eventWhereInput>
  }, "id">

  export type eventGalleryOrderByWithAggregationInput = {
    id?: SortOrder
    imageUrl?: SortOrder
    caption?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    eventId?: SortOrder
    _count?: eventGalleryCountOrderByAggregateInput
    _max?: eventGalleryMaxOrderByAggregateInput
    _min?: eventGalleryMinOrderByAggregateInput
  }

  export type eventGalleryScalarWhereWithAggregatesInput = {
    AND?: eventGalleryScalarWhereWithAggregatesInput | eventGalleryScalarWhereWithAggregatesInput[]
    OR?: eventGalleryScalarWhereWithAggregatesInput[]
    NOT?: eventGalleryScalarWhereWithAggregatesInput | eventGalleryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"eventGallery"> | string
    imageUrl?: StringWithAggregatesFilter<"eventGallery"> | string
    caption?: StringNullableWithAggregatesFilter<"eventGallery"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"eventGallery"> | Date | string
    updatedAt?: DateTimeNullableWithAggregatesFilter<"eventGallery"> | Date | string | null
    eventId?: StringWithAggregatesFilter<"eventGallery"> | string
  }

  export type clubAnnouncementWhereInput = {
    AND?: clubAnnouncementWhereInput | clubAnnouncementWhereInput[]
    OR?: clubAnnouncementWhereInput[]
    NOT?: clubAnnouncementWhereInput | clubAnnouncementWhereInput[]
    id?: StringFilter<"clubAnnouncement"> | string
    Title?: StringFilter<"clubAnnouncement"> | string
    Description?: StringFilter<"clubAnnouncement"> | string
    createdAt?: DateTimeFilter<"clubAnnouncement"> | Date | string
    updatedAt?: DateTimeNullableFilter<"clubAnnouncement"> | Date | string | null
    clubId?: StringFilter<"clubAnnouncement"> | string
    club?: XOR<ClubsScalarRelationFilter, clubsWhereInput>
  }

  export type clubAnnouncementOrderByWithRelationInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    clubId?: SortOrder
    club?: clubsOrderByWithRelationInput
  }

  export type clubAnnouncementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: clubAnnouncementWhereInput | clubAnnouncementWhereInput[]
    OR?: clubAnnouncementWhereInput[]
    NOT?: clubAnnouncementWhereInput | clubAnnouncementWhereInput[]
    Title?: StringFilter<"clubAnnouncement"> | string
    Description?: StringFilter<"clubAnnouncement"> | string
    createdAt?: DateTimeFilter<"clubAnnouncement"> | Date | string
    updatedAt?: DateTimeNullableFilter<"clubAnnouncement"> | Date | string | null
    clubId?: StringFilter<"clubAnnouncement"> | string
    club?: XOR<ClubsScalarRelationFilter, clubsWhereInput>
  }, "id">

  export type clubAnnouncementOrderByWithAggregationInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    clubId?: SortOrder
    _count?: clubAnnouncementCountOrderByAggregateInput
    _max?: clubAnnouncementMaxOrderByAggregateInput
    _min?: clubAnnouncementMinOrderByAggregateInput
  }

  export type clubAnnouncementScalarWhereWithAggregatesInput = {
    AND?: clubAnnouncementScalarWhereWithAggregatesInput | clubAnnouncementScalarWhereWithAggregatesInput[]
    OR?: clubAnnouncementScalarWhereWithAggregatesInput[]
    NOT?: clubAnnouncementScalarWhereWithAggregatesInput | clubAnnouncementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"clubAnnouncement"> | string
    Title?: StringWithAggregatesFilter<"clubAnnouncement"> | string
    Description?: StringWithAggregatesFilter<"clubAnnouncement"> | string
    createdAt?: DateTimeWithAggregatesFilter<"clubAnnouncement"> | Date | string
    updatedAt?: DateTimeNullableWithAggregatesFilter<"clubAnnouncement"> | Date | string | null
    clubId?: StringWithAggregatesFilter<"clubAnnouncement"> | string
  }

  export type userEventsWhereInput = {
    AND?: userEventsWhereInput | userEventsWhereInput[]
    OR?: userEventsWhereInput[]
    NOT?: userEventsWhereInput | userEventsWhereInput[]
    userId?: StringFilter<"userEvents"> | string
    eventId?: StringFilter<"userEvents"> | string
    uniquePassId?: StringNullableFilter<"userEvents"> | string | null
    joinedAt?: DateTimeFilter<"userEvents"> | Date | string
    paymentScreenshotUrl?: StringNullableFilter<"userEvents"> | string | null
    paymentStatus?: StringFilter<"userEvents"> | string
    paymentVerifiedAt?: DateTimeNullableFilter<"userEvents"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    event?: XOR<EventScalarRelationFilter, eventWhereInput>
  }

  export type userEventsOrderByWithRelationInput = {
    userId?: SortOrder
    eventId?: SortOrder
    uniquePassId?: SortOrderInput | SortOrder
    joinedAt?: SortOrder
    paymentScreenshotUrl?: SortOrderInput | SortOrder
    paymentStatus?: SortOrder
    paymentVerifiedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    event?: eventOrderByWithRelationInput
  }

  export type userEventsWhereUniqueInput = Prisma.AtLeast<{
    userId_eventId?: userEventsUserIdEventIdCompoundUniqueInput
    AND?: userEventsWhereInput | userEventsWhereInput[]
    OR?: userEventsWhereInput[]
    NOT?: userEventsWhereInput | userEventsWhereInput[]
    userId?: StringFilter<"userEvents"> | string
    eventId?: StringFilter<"userEvents"> | string
    uniquePassId?: StringNullableFilter<"userEvents"> | string | null
    joinedAt?: DateTimeFilter<"userEvents"> | Date | string
    paymentScreenshotUrl?: StringNullableFilter<"userEvents"> | string | null
    paymentStatus?: StringFilter<"userEvents"> | string
    paymentVerifiedAt?: DateTimeNullableFilter<"userEvents"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    event?: XOR<EventScalarRelationFilter, eventWhereInput>
  }, "userId_eventId">

  export type userEventsOrderByWithAggregationInput = {
    userId?: SortOrder
    eventId?: SortOrder
    uniquePassId?: SortOrderInput | SortOrder
    joinedAt?: SortOrder
    paymentScreenshotUrl?: SortOrderInput | SortOrder
    paymentStatus?: SortOrder
    paymentVerifiedAt?: SortOrderInput | SortOrder
    _count?: userEventsCountOrderByAggregateInput
    _max?: userEventsMaxOrderByAggregateInput
    _min?: userEventsMinOrderByAggregateInput
  }

  export type userEventsScalarWhereWithAggregatesInput = {
    AND?: userEventsScalarWhereWithAggregatesInput | userEventsScalarWhereWithAggregatesInput[]
    OR?: userEventsScalarWhereWithAggregatesInput[]
    NOT?: userEventsScalarWhereWithAggregatesInput | userEventsScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"userEvents"> | string
    eventId?: StringWithAggregatesFilter<"userEvents"> | string
    uniquePassId?: StringNullableWithAggregatesFilter<"userEvents"> | string | null
    joinedAt?: DateTimeWithAggregatesFilter<"userEvents"> | Date | string
    paymentScreenshotUrl?: StringNullableWithAggregatesFilter<"userEvents"> | string | null
    paymentStatus?: StringWithAggregatesFilter<"userEvents"> | string
    paymentVerifiedAt?: DateTimeNullableWithAggregatesFilter<"userEvents"> | Date | string | null
  }

  export type PostUpvoteWhereInput = {
    AND?: PostUpvoteWhereInput | PostUpvoteWhereInput[]
    OR?: PostUpvoteWhereInput[]
    NOT?: PostUpvoteWhereInput | PostUpvoteWhereInput[]
    id?: StringFilter<"PostUpvote"> | string
    postId?: StringFilter<"PostUpvote"> | string
    userId?: StringFilter<"PostUpvote"> | string
    createdAt?: DateTimeFilter<"PostUpvote"> | Date | string
    post?: XOR<CreatePostScalarRelationFilter, CreatePostWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PostUpvoteOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    post?: CreatePostOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type PostUpvoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    postId_userId?: PostUpvotePostIdUserIdCompoundUniqueInput
    AND?: PostUpvoteWhereInput | PostUpvoteWhereInput[]
    OR?: PostUpvoteWhereInput[]
    NOT?: PostUpvoteWhereInput | PostUpvoteWhereInput[]
    postId?: StringFilter<"PostUpvote"> | string
    userId?: StringFilter<"PostUpvote"> | string
    createdAt?: DateTimeFilter<"PostUpvote"> | Date | string
    post?: XOR<CreatePostScalarRelationFilter, CreatePostWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "postId_userId">

  export type PostUpvoteOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: PostUpvoteCountOrderByAggregateInput
    _max?: PostUpvoteMaxOrderByAggregateInput
    _min?: PostUpvoteMinOrderByAggregateInput
  }

  export type PostUpvoteScalarWhereWithAggregatesInput = {
    AND?: PostUpvoteScalarWhereWithAggregatesInput | PostUpvoteScalarWhereWithAggregatesInput[]
    OR?: PostUpvoteScalarWhereWithAggregatesInput[]
    NOT?: PostUpvoteScalarWhereWithAggregatesInput | PostUpvoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PostUpvote"> | string
    postId?: StringWithAggregatesFilter<"PostUpvote"> | string
    userId?: StringWithAggregatesFilter<"PostUpvote"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PostUpvote"> | Date | string
  }

  export type PostDownvoteWhereInput = {
    AND?: PostDownvoteWhereInput | PostDownvoteWhereInput[]
    OR?: PostDownvoteWhereInput[]
    NOT?: PostDownvoteWhereInput | PostDownvoteWhereInput[]
    id?: StringFilter<"PostDownvote"> | string
    postId?: StringFilter<"PostDownvote"> | string
    userId?: StringFilter<"PostDownvote"> | string
    createdAt?: DateTimeFilter<"PostDownvote"> | Date | string
    post?: XOR<CreatePostScalarRelationFilter, CreatePostWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PostDownvoteOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    post?: CreatePostOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type PostDownvoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    postId_userId?: PostDownvotePostIdUserIdCompoundUniqueInput
    AND?: PostDownvoteWhereInput | PostDownvoteWhereInput[]
    OR?: PostDownvoteWhereInput[]
    NOT?: PostDownvoteWhereInput | PostDownvoteWhereInput[]
    postId?: StringFilter<"PostDownvote"> | string
    userId?: StringFilter<"PostDownvote"> | string
    createdAt?: DateTimeFilter<"PostDownvote"> | Date | string
    post?: XOR<CreatePostScalarRelationFilter, CreatePostWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "postId_userId">

  export type PostDownvoteOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: PostDownvoteCountOrderByAggregateInput
    _max?: PostDownvoteMaxOrderByAggregateInput
    _min?: PostDownvoteMinOrderByAggregateInput
  }

  export type PostDownvoteScalarWhereWithAggregatesInput = {
    AND?: PostDownvoteScalarWhereWithAggregatesInput | PostDownvoteScalarWhereWithAggregatesInput[]
    OR?: PostDownvoteScalarWhereWithAggregatesInput[]
    NOT?: PostDownvoteScalarWhereWithAggregatesInput | PostDownvoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PostDownvote"> | string
    postId?: StringWithAggregatesFilter<"PostDownvote"> | string
    userId?: StringWithAggregatesFilter<"PostDownvote"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PostDownvote"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsCreateNestedManyWithoutUserInput
    club?: clubsCreateNestedOneWithoutMembersInput
    CreatePost?: CreatePostCreateNestedManyWithoutAuthorInput
    postUpvotes?: PostUpvoteCreateNestedManyWithoutUserInput
    postDownvotes?: PostDownvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    clubId?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsUncheckedCreateNestedManyWithoutUserInput
    CreatePost?: CreatePostUncheckedCreateNestedManyWithoutAuthorInput
    postUpvotes?: PostUpvoteUncheckedCreateNestedManyWithoutUserInput
    postDownvotes?: PostDownvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUpdateManyWithoutUserNestedInput
    club?: clubsUpdateOneWithoutMembersNestedInput
    CreatePost?: CreatePostUpdateManyWithoutAuthorNestedInput
    postUpvotes?: PostUpvoteUpdateManyWithoutUserNestedInput
    postDownvotes?: PostDownvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUncheckedUpdateManyWithoutUserNestedInput
    CreatePost?: CreatePostUncheckedUpdateManyWithoutAuthorNestedInput
    postUpvotes?: PostUpvoteUncheckedUpdateManyWithoutUserNestedInput
    postDownvotes?: PostDownvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    clubId?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type clubsCreateInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    posts?: CreatePostCreateNestedManyWithoutClubInput
    members?: UserCreateNestedManyWithoutClubInput
    events?: eventCreateNestedManyWithoutClubInput
    announcements?: clubAnnouncementCreateNestedManyWithoutClubInput
  }

  export type clubsUncheckedCreateInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    posts?: CreatePostUncheckedCreateNestedManyWithoutClubInput
    members?: UserUncheckedCreateNestedManyWithoutClubInput
    events?: eventUncheckedCreateNestedManyWithoutClubInput
    announcements?: clubAnnouncementUncheckedCreateNestedManyWithoutClubInput
  }

  export type clubsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    posts?: CreatePostUpdateManyWithoutClubNestedInput
    members?: UserUpdateManyWithoutClubNestedInput
    events?: eventUpdateManyWithoutClubNestedInput
    announcements?: clubAnnouncementUpdateManyWithoutClubNestedInput
  }

  export type clubsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    posts?: CreatePostUncheckedUpdateManyWithoutClubNestedInput
    members?: UserUncheckedUpdateManyWithoutClubNestedInput
    events?: eventUncheckedUpdateManyWithoutClubNestedInput
    announcements?: clubAnnouncementUncheckedUpdateManyWithoutClubNestedInput
  }

  export type clubsCreateManyInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
  }

  export type clubsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type clubsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CreatePostCreateInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    club?: clubsCreateNestedOneWithoutPostsInput
    author: UserCreateNestedOneWithoutCreatePostInput
    upvotes?: PostUpvoteCreateNestedManyWithoutPostInput
    downvotes?: PostDownvoteCreateNestedManyWithoutPostInput
  }

  export type CreatePostUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    collegeId?: string | null
    authorId: string
    upvotes?: PostUpvoteUncheckedCreateNestedManyWithoutPostInput
    downvotes?: PostDownvoteUncheckedCreateNestedManyWithoutPostInput
  }

  export type CreatePostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    club?: clubsUpdateOneWithoutPostsNestedInput
    author?: UserUpdateOneRequiredWithoutCreatePostNestedInput
    upvotes?: PostUpvoteUpdateManyWithoutPostNestedInput
    downvotes?: PostDownvoteUpdateManyWithoutPostNestedInput
  }

  export type CreatePostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    collegeId?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    upvotes?: PostUpvoteUncheckedUpdateManyWithoutPostNestedInput
    downvotes?: PostDownvoteUncheckedUpdateManyWithoutPostNestedInput
  }

  export type CreatePostCreateManyInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    collegeId?: string | null
    authorId: string
  }

  export type CreatePostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
  }

  export type CreatePostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    collegeId?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
  }

  export type speakersCreateInput = {
    profilePic?: string | null
    about: string
    name: string
    email: string
    event: eventCreateNestedOneWithoutSpeakersInput
  }

  export type speakersUncheckedCreateInput = {
    id?: number
    profilePic?: string | null
    about: string
    name: string
    email: string
    eventId: string
  }

  export type speakersUpdateInput = {
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    about?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    event?: eventUpdateOneRequiredWithoutSpeakersNestedInput
  }

  export type speakersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    about?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
  }

  export type speakersCreateManyInput = {
    id?: number
    profilePic?: string | null
    about: string
    name: string
    email: string
    eventId: string
  }

  export type speakersUpdateManyMutationInput = {
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    about?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type speakersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    about?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
  }

  export type eventCreateInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    club: clubsCreateNestedOneWithoutEventsInput
    speakers?: speakersCreateNestedManyWithoutEventInput
    attendees?: userEventsCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementCreateNestedManyWithoutEventInput
    galleries?: eventGalleryCreateNestedManyWithoutEventInput
  }

  export type eventUncheckedCreateInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    clubId: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    speakers?: speakersUncheckedCreateNestedManyWithoutEventInput
    attendees?: userEventsUncheckedCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementUncheckedCreateNestedManyWithoutEventInput
    galleries?: eventGalleryUncheckedCreateNestedManyWithoutEventInput
  }

  export type eventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    club?: clubsUpdateOneRequiredWithoutEventsNestedInput
    speakers?: speakersUpdateManyWithoutEventNestedInput
    attendees?: userEventsUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUpdateManyWithoutEventNestedInput
  }

  export type eventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    clubId?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    speakers?: speakersUncheckedUpdateManyWithoutEventNestedInput
    attendees?: userEventsUncheckedUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUncheckedUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUncheckedUpdateManyWithoutEventNestedInput
  }

  export type eventCreateManyInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    clubId: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
  }

  export type eventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type eventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    clubId?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type eventAnnouncementCreateInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    event: eventCreateNestedOneWithoutAnnouncementsInput
  }

  export type eventAnnouncementUncheckedCreateInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    eventId: string
  }

  export type eventAnnouncementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    event?: eventUpdateOneRequiredWithoutAnnouncementsNestedInput
  }

  export type eventAnnouncementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventId?: StringFieldUpdateOperationsInput | string
  }

  export type eventAnnouncementCreateManyInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    eventId: string
  }

  export type eventAnnouncementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventAnnouncementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventId?: StringFieldUpdateOperationsInput | string
  }

  export type eventGalleryCreateInput = {
    id?: string
    imageUrl: string
    caption?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    event: eventCreateNestedOneWithoutGalleriesInput
  }

  export type eventGalleryUncheckedCreateInput = {
    id?: string
    imageUrl: string
    caption?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    eventId: string
  }

  export type eventGalleryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    event?: eventUpdateOneRequiredWithoutGalleriesNestedInput
  }

  export type eventGalleryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventId?: StringFieldUpdateOperationsInput | string
  }

  export type eventGalleryCreateManyInput = {
    id?: string
    imageUrl: string
    caption?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    eventId: string
  }

  export type eventGalleryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventGalleryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eventId?: StringFieldUpdateOperationsInput | string
  }

  export type clubAnnouncementCreateInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    club: clubsCreateNestedOneWithoutAnnouncementsInput
  }

  export type clubAnnouncementUncheckedCreateInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    clubId: string
  }

  export type clubAnnouncementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    club?: clubsUpdateOneRequiredWithoutAnnouncementsNestedInput
  }

  export type clubAnnouncementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clubId?: StringFieldUpdateOperationsInput | string
  }

  export type clubAnnouncementCreateManyInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    clubId: string
  }

  export type clubAnnouncementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type clubAnnouncementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clubId?: StringFieldUpdateOperationsInput | string
  }

  export type userEventsCreateInput = {
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
    user: UserCreateNestedOneWithoutEventAttendedInput
    event: eventCreateNestedOneWithoutAttendeesInput
  }

  export type userEventsUncheckedCreateInput = {
    userId: string
    eventId: string
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
  }

  export type userEventsUpdateInput = {
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutEventAttendedNestedInput
    event?: eventUpdateOneRequiredWithoutAttendeesNestedInput
  }

  export type userEventsUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type userEventsCreateManyInput = {
    userId: string
    eventId: string
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
  }

  export type userEventsUpdateManyMutationInput = {
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type userEventsUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PostUpvoteCreateInput = {
    id?: string
    createdAt?: Date | string
    post: CreatePostCreateNestedOneWithoutUpvotesInput
    user: UserCreateNestedOneWithoutPostUpvotesInput
  }

  export type PostUpvoteUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
    createdAt?: Date | string
  }

  export type PostUpvoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CreatePostUpdateOneRequiredWithoutUpvotesNestedInput
    user?: UserUpdateOneRequiredWithoutPostUpvotesNestedInput
  }

  export type PostUpvoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpvoteCreateManyInput = {
    id?: string
    postId: string
    userId: string
    createdAt?: Date | string
  }

  export type PostUpvoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpvoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostDownvoteCreateInput = {
    id?: string
    createdAt?: Date | string
    post: CreatePostCreateNestedOneWithoutDownvotesInput
    user: UserCreateNestedOneWithoutPostDownvotesInput
  }

  export type PostDownvoteUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
    createdAt?: Date | string
  }

  export type PostDownvoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CreatePostUpdateOneRequiredWithoutDownvotesNestedInput
    user?: UserUpdateOneRequiredWithoutPostDownvotesNestedInput
  }

  export type PostDownvoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostDownvoteCreateManyInput = {
    id?: string
    postId: string
    userId: string
    createdAt?: Date | string
  }

  export type PostDownvoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostDownvoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type UserEventsListRelationFilter = {
    every?: userEventsWhereInput
    some?: userEventsWhereInput
    none?: userEventsWhereInput
  }

  export type ClubsNullableScalarRelationFilter = {
    is?: clubsWhereInput | null
    isNot?: clubsWhereInput | null
  }

  export type CreatePostListRelationFilter = {
    every?: CreatePostWhereInput
    some?: CreatePostWhereInput
    none?: CreatePostWhereInput
  }

  export type PostUpvoteListRelationFilter = {
    every?: PostUpvoteWhereInput
    some?: PostUpvoteWhereInput
    none?: PostUpvoteWhereInput
  }

  export type PostDownvoteListRelationFilter = {
    every?: PostDownvoteWhereInput
    some?: PostDownvoteWhereInput
    none?: PostDownvoteWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type userEventsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CreatePostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostUpvoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostDownvoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    collegeName?: SortOrder
    name?: SortOrder
    profileAvatar?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    vToken?: SortOrder
    expiryToken?: SortOrder
    ValidFor?: SortOrder
    isVerified?: SortOrder
    clubName?: SortOrder
    clubId?: SortOrder
    bio?: SortOrder
    tags?: SortOrder
    course?: SortOrder
    year?: SortOrder
    phone?: SortOrder
    twitter?: SortOrder
    linkedin?: SortOrder
    instagram?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    expiryToken?: SortOrder
    ValidFor?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    collegeName?: SortOrder
    name?: SortOrder
    profileAvatar?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    vToken?: SortOrder
    expiryToken?: SortOrder
    ValidFor?: SortOrder
    isVerified?: SortOrder
    clubName?: SortOrder
    clubId?: SortOrder
    bio?: SortOrder
    course?: SortOrder
    year?: SortOrder
    phone?: SortOrder
    twitter?: SortOrder
    linkedin?: SortOrder
    instagram?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    collegeName?: SortOrder
    name?: SortOrder
    profileAvatar?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    vToken?: SortOrder
    expiryToken?: SortOrder
    ValidFor?: SortOrder
    isVerified?: SortOrder
    clubName?: SortOrder
    clubId?: SortOrder
    bio?: SortOrder
    course?: SortOrder
    year?: SortOrder
    phone?: SortOrder
    twitter?: SortOrder
    linkedin?: SortOrder
    instagram?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    expiryToken?: SortOrder
    ValidFor?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type EventListRelationFilter = {
    every?: eventWhereInput
    some?: eventWhereInput
    none?: eventWhereInput
  }

  export type ClubAnnouncementListRelationFilter = {
    every?: clubAnnouncementWhereInput
    some?: clubAnnouncementWhereInput
    none?: clubAnnouncementWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type eventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type clubAnnouncementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type clubsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    founderEmail?: SortOrder
    coremember1?: SortOrder
    coremember2?: SortOrder
    coremember3?: SortOrder
    facultyEmail?: SortOrder
    collegeName?: SortOrder
    collegeId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    profilePicUrl?: SortOrder
    clubContact?: SortOrder
    wings?: SortOrder
    instagram?: SortOrder
    twitter?: SortOrder
    linkedin?: SortOrder
  }

  export type clubsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    founderEmail?: SortOrder
    coremember1?: SortOrder
    coremember2?: SortOrder
    coremember3?: SortOrder
    facultyEmail?: SortOrder
    collegeName?: SortOrder
    collegeId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    profilePicUrl?: SortOrder
    clubContact?: SortOrder
    instagram?: SortOrder
    twitter?: SortOrder
    linkedin?: SortOrder
  }

  export type clubsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    founderEmail?: SortOrder
    coremember1?: SortOrder
    coremember2?: SortOrder
    coremember3?: SortOrder
    facultyEmail?: SortOrder
    collegeName?: SortOrder
    collegeId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    profilePicUrl?: SortOrder
    clubContact?: SortOrder
    instagram?: SortOrder
    twitter?: SortOrder
    linkedin?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CreatePostCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    published?: SortOrder
    collegeName?: SortOrder
    clubName?: SortOrder
    collegeId?: SortOrder
    authorId?: SortOrder
  }

  export type CreatePostMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    published?: SortOrder
    collegeName?: SortOrder
    clubName?: SortOrder
    collegeId?: SortOrder
    authorId?: SortOrder
  }

  export type CreatePostMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    published?: SortOrder
    collegeName?: SortOrder
    clubName?: SortOrder
    collegeId?: SortOrder
    authorId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EventScalarRelationFilter = {
    is?: eventWhereInput
    isNot?: eventWhereInput
  }

  export type speakersCountOrderByAggregateInput = {
    id?: SortOrder
    profilePic?: SortOrder
    about?: SortOrder
    name?: SortOrder
    email?: SortOrder
    eventId?: SortOrder
  }

  export type speakersAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type speakersMaxOrderByAggregateInput = {
    id?: SortOrder
    profilePic?: SortOrder
    about?: SortOrder
    name?: SortOrder
    email?: SortOrder
    eventId?: SortOrder
  }

  export type speakersMinOrderByAggregateInput = {
    id?: SortOrder
    profilePic?: SortOrder
    about?: SortOrder
    name?: SortOrder
    email?: SortOrder
    eventId?: SortOrder
  }

  export type speakersSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ClubsScalarRelationFilter = {
    is?: clubsWhereInput
    isNot?: clubsWhereInput
  }

  export type SpeakersListRelationFilter = {
    every?: speakersWhereInput
    some?: speakersWhereInput
    none?: speakersWhereInput
  }

  export type EventAnnouncementListRelationFilter = {
    every?: eventAnnouncementWhereInput
    some?: eventAnnouncementWhereInput
    none?: eventAnnouncementWhereInput
  }

  export type EventGalleryListRelationFilter = {
    every?: eventGalleryWhereInput
    some?: eventGalleryWhereInput
    none?: eventGalleryWhereInput
  }

  export type speakersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type eventAnnouncementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type eventGalleryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type eventCountOrderByAggregateInput = {
    id?: SortOrder
    posterUrl?: SortOrder
    EventMode?: SortOrder
    EventType?: SortOrder
    eventHeaderImage?: SortOrder
    EventName?: SortOrder
    description?: SortOrder
    tagline?: SortOrder
    prizes?: SortOrder
    TeamSize?: SortOrder
    Venue?: SortOrder
    EventUrl?: SortOrder
    applicationStatus?: SortOrder
    applicationStartDate?: SortOrder
    applicationEndDate?: SortOrder
    clubName?: SortOrder
    clubId?: SortOrder
    university?: SortOrder
    createdAt?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    collegeStudentsOnly?: SortOrder
    participationFee?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    Form?: SortOrder
    Fees?: SortOrder
    link1?: SortOrder
    link2?: SortOrder
    link3?: SortOrder
    whatsappLink?: SortOrder
    isPaid?: SortOrder
    qrCodeUrl?: SortOrder
  }

  export type eventAvgOrderByAggregateInput = {
    TeamSize?: SortOrder
  }

  export type eventMaxOrderByAggregateInput = {
    id?: SortOrder
    posterUrl?: SortOrder
    EventMode?: SortOrder
    EventType?: SortOrder
    eventHeaderImage?: SortOrder
    EventName?: SortOrder
    description?: SortOrder
    tagline?: SortOrder
    prizes?: SortOrder
    TeamSize?: SortOrder
    Venue?: SortOrder
    EventUrl?: SortOrder
    applicationStatus?: SortOrder
    applicationStartDate?: SortOrder
    applicationEndDate?: SortOrder
    clubName?: SortOrder
    clubId?: SortOrder
    university?: SortOrder
    createdAt?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    collegeStudentsOnly?: SortOrder
    participationFee?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    Form?: SortOrder
    Fees?: SortOrder
    link1?: SortOrder
    link2?: SortOrder
    link3?: SortOrder
    whatsappLink?: SortOrder
    isPaid?: SortOrder
    qrCodeUrl?: SortOrder
  }

  export type eventMinOrderByAggregateInput = {
    id?: SortOrder
    posterUrl?: SortOrder
    EventMode?: SortOrder
    EventType?: SortOrder
    eventHeaderImage?: SortOrder
    EventName?: SortOrder
    description?: SortOrder
    tagline?: SortOrder
    prizes?: SortOrder
    TeamSize?: SortOrder
    Venue?: SortOrder
    EventUrl?: SortOrder
    applicationStatus?: SortOrder
    applicationStartDate?: SortOrder
    applicationEndDate?: SortOrder
    clubName?: SortOrder
    clubId?: SortOrder
    university?: SortOrder
    createdAt?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    collegeStudentsOnly?: SortOrder
    participationFee?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    Form?: SortOrder
    Fees?: SortOrder
    link1?: SortOrder
    link2?: SortOrder
    link3?: SortOrder
    whatsappLink?: SortOrder
    isPaid?: SortOrder
    qrCodeUrl?: SortOrder
  }

  export type eventSumOrderByAggregateInput = {
    TeamSize?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type eventAnnouncementCountOrderByAggregateInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    eventId?: SortOrder
  }

  export type eventAnnouncementMaxOrderByAggregateInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    eventId?: SortOrder
  }

  export type eventAnnouncementMinOrderByAggregateInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    eventId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type eventGalleryCountOrderByAggregateInput = {
    id?: SortOrder
    imageUrl?: SortOrder
    caption?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    eventId?: SortOrder
  }

  export type eventGalleryMaxOrderByAggregateInput = {
    id?: SortOrder
    imageUrl?: SortOrder
    caption?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    eventId?: SortOrder
  }

  export type eventGalleryMinOrderByAggregateInput = {
    id?: SortOrder
    imageUrl?: SortOrder
    caption?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    eventId?: SortOrder
  }

  export type clubAnnouncementCountOrderByAggregateInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clubId?: SortOrder
  }

  export type clubAnnouncementMaxOrderByAggregateInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clubId?: SortOrder
  }

  export type clubAnnouncementMinOrderByAggregateInput = {
    id?: SortOrder
    Title?: SortOrder
    Description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clubId?: SortOrder
  }

  export type userEventsUserIdEventIdCompoundUniqueInput = {
    userId: string
    eventId: string
  }

  export type userEventsCountOrderByAggregateInput = {
    userId?: SortOrder
    eventId?: SortOrder
    uniquePassId?: SortOrder
    joinedAt?: SortOrder
    paymentScreenshotUrl?: SortOrder
    paymentStatus?: SortOrder
    paymentVerifiedAt?: SortOrder
  }

  export type userEventsMaxOrderByAggregateInput = {
    userId?: SortOrder
    eventId?: SortOrder
    uniquePassId?: SortOrder
    joinedAt?: SortOrder
    paymentScreenshotUrl?: SortOrder
    paymentStatus?: SortOrder
    paymentVerifiedAt?: SortOrder
  }

  export type userEventsMinOrderByAggregateInput = {
    userId?: SortOrder
    eventId?: SortOrder
    uniquePassId?: SortOrder
    joinedAt?: SortOrder
    paymentScreenshotUrl?: SortOrder
    paymentStatus?: SortOrder
    paymentVerifiedAt?: SortOrder
  }

  export type CreatePostScalarRelationFilter = {
    is?: CreatePostWhereInput
    isNot?: CreatePostWhereInput
  }

  export type PostUpvotePostIdUserIdCompoundUniqueInput = {
    postId: string
    userId: string
  }

  export type PostUpvoteCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type PostUpvoteMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type PostUpvoteMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type PostDownvotePostIdUserIdCompoundUniqueInput = {
    postId: string
    userId: string
  }

  export type PostDownvoteCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type PostDownvoteMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type PostDownvoteMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserCreatetagsInput = {
    set: string[]
  }

  export type userEventsCreateNestedManyWithoutUserInput = {
    create?: XOR<userEventsCreateWithoutUserInput, userEventsUncheckedCreateWithoutUserInput> | userEventsCreateWithoutUserInput[] | userEventsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: userEventsCreateOrConnectWithoutUserInput | userEventsCreateOrConnectWithoutUserInput[]
    createMany?: userEventsCreateManyUserInputEnvelope
    connect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
  }

  export type clubsCreateNestedOneWithoutMembersInput = {
    create?: XOR<clubsCreateWithoutMembersInput, clubsUncheckedCreateWithoutMembersInput>
    connectOrCreate?: clubsCreateOrConnectWithoutMembersInput
    connect?: clubsWhereUniqueInput
  }

  export type CreatePostCreateNestedManyWithoutAuthorInput = {
    create?: XOR<CreatePostCreateWithoutAuthorInput, CreatePostUncheckedCreateWithoutAuthorInput> | CreatePostCreateWithoutAuthorInput[] | CreatePostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CreatePostCreateOrConnectWithoutAuthorInput | CreatePostCreateOrConnectWithoutAuthorInput[]
    createMany?: CreatePostCreateManyAuthorInputEnvelope
    connect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
  }

  export type PostUpvoteCreateNestedManyWithoutUserInput = {
    create?: XOR<PostUpvoteCreateWithoutUserInput, PostUpvoteUncheckedCreateWithoutUserInput> | PostUpvoteCreateWithoutUserInput[] | PostUpvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostUpvoteCreateOrConnectWithoutUserInput | PostUpvoteCreateOrConnectWithoutUserInput[]
    createMany?: PostUpvoteCreateManyUserInputEnvelope
    connect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
  }

  export type PostDownvoteCreateNestedManyWithoutUserInput = {
    create?: XOR<PostDownvoteCreateWithoutUserInput, PostDownvoteUncheckedCreateWithoutUserInput> | PostDownvoteCreateWithoutUserInput[] | PostDownvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostDownvoteCreateOrConnectWithoutUserInput | PostDownvoteCreateOrConnectWithoutUserInput[]
    createMany?: PostDownvoteCreateManyUserInputEnvelope
    connect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
  }

  export type userEventsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<userEventsCreateWithoutUserInput, userEventsUncheckedCreateWithoutUserInput> | userEventsCreateWithoutUserInput[] | userEventsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: userEventsCreateOrConnectWithoutUserInput | userEventsCreateOrConnectWithoutUserInput[]
    createMany?: userEventsCreateManyUserInputEnvelope
    connect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
  }

  export type CreatePostUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<CreatePostCreateWithoutAuthorInput, CreatePostUncheckedCreateWithoutAuthorInput> | CreatePostCreateWithoutAuthorInput[] | CreatePostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CreatePostCreateOrConnectWithoutAuthorInput | CreatePostCreateOrConnectWithoutAuthorInput[]
    createMany?: CreatePostCreateManyAuthorInputEnvelope
    connect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
  }

  export type PostUpvoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PostUpvoteCreateWithoutUserInput, PostUpvoteUncheckedCreateWithoutUserInput> | PostUpvoteCreateWithoutUserInput[] | PostUpvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostUpvoteCreateOrConnectWithoutUserInput | PostUpvoteCreateOrConnectWithoutUserInput[]
    createMany?: PostUpvoteCreateManyUserInputEnvelope
    connect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
  }

  export type PostDownvoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PostDownvoteCreateWithoutUserInput, PostDownvoteUncheckedCreateWithoutUserInput> | PostDownvoteCreateWithoutUserInput[] | PostDownvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostDownvoteCreateOrConnectWithoutUserInput | PostDownvoteCreateOrConnectWithoutUserInput[]
    createMany?: PostDownvoteCreateManyUserInputEnvelope
    connect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type UserUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type userEventsUpdateManyWithoutUserNestedInput = {
    create?: XOR<userEventsCreateWithoutUserInput, userEventsUncheckedCreateWithoutUserInput> | userEventsCreateWithoutUserInput[] | userEventsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: userEventsCreateOrConnectWithoutUserInput | userEventsCreateOrConnectWithoutUserInput[]
    upsert?: userEventsUpsertWithWhereUniqueWithoutUserInput | userEventsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: userEventsCreateManyUserInputEnvelope
    set?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    disconnect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    delete?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    connect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    update?: userEventsUpdateWithWhereUniqueWithoutUserInput | userEventsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: userEventsUpdateManyWithWhereWithoutUserInput | userEventsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: userEventsScalarWhereInput | userEventsScalarWhereInput[]
  }

  export type clubsUpdateOneWithoutMembersNestedInput = {
    create?: XOR<clubsCreateWithoutMembersInput, clubsUncheckedCreateWithoutMembersInput>
    connectOrCreate?: clubsCreateOrConnectWithoutMembersInput
    upsert?: clubsUpsertWithoutMembersInput
    disconnect?: clubsWhereInput | boolean
    delete?: clubsWhereInput | boolean
    connect?: clubsWhereUniqueInput
    update?: XOR<XOR<clubsUpdateToOneWithWhereWithoutMembersInput, clubsUpdateWithoutMembersInput>, clubsUncheckedUpdateWithoutMembersInput>
  }

  export type CreatePostUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<CreatePostCreateWithoutAuthorInput, CreatePostUncheckedCreateWithoutAuthorInput> | CreatePostCreateWithoutAuthorInput[] | CreatePostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CreatePostCreateOrConnectWithoutAuthorInput | CreatePostCreateOrConnectWithoutAuthorInput[]
    upsert?: CreatePostUpsertWithWhereUniqueWithoutAuthorInput | CreatePostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: CreatePostCreateManyAuthorInputEnvelope
    set?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    disconnect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    delete?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    connect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    update?: CreatePostUpdateWithWhereUniqueWithoutAuthorInput | CreatePostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: CreatePostUpdateManyWithWhereWithoutAuthorInput | CreatePostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: CreatePostScalarWhereInput | CreatePostScalarWhereInput[]
  }

  export type PostUpvoteUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostUpvoteCreateWithoutUserInput, PostUpvoteUncheckedCreateWithoutUserInput> | PostUpvoteCreateWithoutUserInput[] | PostUpvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostUpvoteCreateOrConnectWithoutUserInput | PostUpvoteCreateOrConnectWithoutUserInput[]
    upsert?: PostUpvoteUpsertWithWhereUniqueWithoutUserInput | PostUpvoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostUpvoteCreateManyUserInputEnvelope
    set?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    disconnect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    delete?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    connect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    update?: PostUpvoteUpdateWithWhereUniqueWithoutUserInput | PostUpvoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostUpvoteUpdateManyWithWhereWithoutUserInput | PostUpvoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostUpvoteScalarWhereInput | PostUpvoteScalarWhereInput[]
  }

  export type PostDownvoteUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostDownvoteCreateWithoutUserInput, PostDownvoteUncheckedCreateWithoutUserInput> | PostDownvoteCreateWithoutUserInput[] | PostDownvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostDownvoteCreateOrConnectWithoutUserInput | PostDownvoteCreateOrConnectWithoutUserInput[]
    upsert?: PostDownvoteUpsertWithWhereUniqueWithoutUserInput | PostDownvoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostDownvoteCreateManyUserInputEnvelope
    set?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    disconnect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    delete?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    connect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    update?: PostDownvoteUpdateWithWhereUniqueWithoutUserInput | PostDownvoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostDownvoteUpdateManyWithWhereWithoutUserInput | PostDownvoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostDownvoteScalarWhereInput | PostDownvoteScalarWhereInput[]
  }

  export type userEventsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<userEventsCreateWithoutUserInput, userEventsUncheckedCreateWithoutUserInput> | userEventsCreateWithoutUserInput[] | userEventsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: userEventsCreateOrConnectWithoutUserInput | userEventsCreateOrConnectWithoutUserInput[]
    upsert?: userEventsUpsertWithWhereUniqueWithoutUserInput | userEventsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: userEventsCreateManyUserInputEnvelope
    set?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    disconnect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    delete?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    connect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    update?: userEventsUpdateWithWhereUniqueWithoutUserInput | userEventsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: userEventsUpdateManyWithWhereWithoutUserInput | userEventsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: userEventsScalarWhereInput | userEventsScalarWhereInput[]
  }

  export type CreatePostUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<CreatePostCreateWithoutAuthorInput, CreatePostUncheckedCreateWithoutAuthorInput> | CreatePostCreateWithoutAuthorInput[] | CreatePostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CreatePostCreateOrConnectWithoutAuthorInput | CreatePostCreateOrConnectWithoutAuthorInput[]
    upsert?: CreatePostUpsertWithWhereUniqueWithoutAuthorInput | CreatePostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: CreatePostCreateManyAuthorInputEnvelope
    set?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    disconnect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    delete?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    connect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    update?: CreatePostUpdateWithWhereUniqueWithoutAuthorInput | CreatePostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: CreatePostUpdateManyWithWhereWithoutAuthorInput | CreatePostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: CreatePostScalarWhereInput | CreatePostScalarWhereInput[]
  }

  export type PostUpvoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostUpvoteCreateWithoutUserInput, PostUpvoteUncheckedCreateWithoutUserInput> | PostUpvoteCreateWithoutUserInput[] | PostUpvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostUpvoteCreateOrConnectWithoutUserInput | PostUpvoteCreateOrConnectWithoutUserInput[]
    upsert?: PostUpvoteUpsertWithWhereUniqueWithoutUserInput | PostUpvoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostUpvoteCreateManyUserInputEnvelope
    set?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    disconnect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    delete?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    connect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    update?: PostUpvoteUpdateWithWhereUniqueWithoutUserInput | PostUpvoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostUpvoteUpdateManyWithWhereWithoutUserInput | PostUpvoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostUpvoteScalarWhereInput | PostUpvoteScalarWhereInput[]
  }

  export type PostDownvoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostDownvoteCreateWithoutUserInput, PostDownvoteUncheckedCreateWithoutUserInput> | PostDownvoteCreateWithoutUserInput[] | PostDownvoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostDownvoteCreateOrConnectWithoutUserInput | PostDownvoteCreateOrConnectWithoutUserInput[]
    upsert?: PostDownvoteUpsertWithWhereUniqueWithoutUserInput | PostDownvoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostDownvoteCreateManyUserInputEnvelope
    set?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    disconnect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    delete?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    connect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    update?: PostDownvoteUpdateWithWhereUniqueWithoutUserInput | PostDownvoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostDownvoteUpdateManyWithWhereWithoutUserInput | PostDownvoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostDownvoteScalarWhereInput | PostDownvoteScalarWhereInput[]
  }

  export type clubsCreatewingsInput = {
    set: string[]
  }

  export type CreatePostCreateNestedManyWithoutClubInput = {
    create?: XOR<CreatePostCreateWithoutClubInput, CreatePostUncheckedCreateWithoutClubInput> | CreatePostCreateWithoutClubInput[] | CreatePostUncheckedCreateWithoutClubInput[]
    connectOrCreate?: CreatePostCreateOrConnectWithoutClubInput | CreatePostCreateOrConnectWithoutClubInput[]
    createMany?: CreatePostCreateManyClubInputEnvelope
    connect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutClubInput = {
    create?: XOR<UserCreateWithoutClubInput, UserUncheckedCreateWithoutClubInput> | UserCreateWithoutClubInput[] | UserUncheckedCreateWithoutClubInput[]
    connectOrCreate?: UserCreateOrConnectWithoutClubInput | UserCreateOrConnectWithoutClubInput[]
    createMany?: UserCreateManyClubInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type eventCreateNestedManyWithoutClubInput = {
    create?: XOR<eventCreateWithoutClubInput, eventUncheckedCreateWithoutClubInput> | eventCreateWithoutClubInput[] | eventUncheckedCreateWithoutClubInput[]
    connectOrCreate?: eventCreateOrConnectWithoutClubInput | eventCreateOrConnectWithoutClubInput[]
    createMany?: eventCreateManyClubInputEnvelope
    connect?: eventWhereUniqueInput | eventWhereUniqueInput[]
  }

  export type clubAnnouncementCreateNestedManyWithoutClubInput = {
    create?: XOR<clubAnnouncementCreateWithoutClubInput, clubAnnouncementUncheckedCreateWithoutClubInput> | clubAnnouncementCreateWithoutClubInput[] | clubAnnouncementUncheckedCreateWithoutClubInput[]
    connectOrCreate?: clubAnnouncementCreateOrConnectWithoutClubInput | clubAnnouncementCreateOrConnectWithoutClubInput[]
    createMany?: clubAnnouncementCreateManyClubInputEnvelope
    connect?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
  }

  export type CreatePostUncheckedCreateNestedManyWithoutClubInput = {
    create?: XOR<CreatePostCreateWithoutClubInput, CreatePostUncheckedCreateWithoutClubInput> | CreatePostCreateWithoutClubInput[] | CreatePostUncheckedCreateWithoutClubInput[]
    connectOrCreate?: CreatePostCreateOrConnectWithoutClubInput | CreatePostCreateOrConnectWithoutClubInput[]
    createMany?: CreatePostCreateManyClubInputEnvelope
    connect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutClubInput = {
    create?: XOR<UserCreateWithoutClubInput, UserUncheckedCreateWithoutClubInput> | UserCreateWithoutClubInput[] | UserUncheckedCreateWithoutClubInput[]
    connectOrCreate?: UserCreateOrConnectWithoutClubInput | UserCreateOrConnectWithoutClubInput[]
    createMany?: UserCreateManyClubInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type eventUncheckedCreateNestedManyWithoutClubInput = {
    create?: XOR<eventCreateWithoutClubInput, eventUncheckedCreateWithoutClubInput> | eventCreateWithoutClubInput[] | eventUncheckedCreateWithoutClubInput[]
    connectOrCreate?: eventCreateOrConnectWithoutClubInput | eventCreateOrConnectWithoutClubInput[]
    createMany?: eventCreateManyClubInputEnvelope
    connect?: eventWhereUniqueInput | eventWhereUniqueInput[]
  }

  export type clubAnnouncementUncheckedCreateNestedManyWithoutClubInput = {
    create?: XOR<clubAnnouncementCreateWithoutClubInput, clubAnnouncementUncheckedCreateWithoutClubInput> | clubAnnouncementCreateWithoutClubInput[] | clubAnnouncementUncheckedCreateWithoutClubInput[]
    connectOrCreate?: clubAnnouncementCreateOrConnectWithoutClubInput | clubAnnouncementCreateOrConnectWithoutClubInput[]
    createMany?: clubAnnouncementCreateManyClubInputEnvelope
    connect?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
  }

  export type clubsUpdatewingsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type CreatePostUpdateManyWithoutClubNestedInput = {
    create?: XOR<CreatePostCreateWithoutClubInput, CreatePostUncheckedCreateWithoutClubInput> | CreatePostCreateWithoutClubInput[] | CreatePostUncheckedCreateWithoutClubInput[]
    connectOrCreate?: CreatePostCreateOrConnectWithoutClubInput | CreatePostCreateOrConnectWithoutClubInput[]
    upsert?: CreatePostUpsertWithWhereUniqueWithoutClubInput | CreatePostUpsertWithWhereUniqueWithoutClubInput[]
    createMany?: CreatePostCreateManyClubInputEnvelope
    set?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    disconnect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    delete?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    connect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    update?: CreatePostUpdateWithWhereUniqueWithoutClubInput | CreatePostUpdateWithWhereUniqueWithoutClubInput[]
    updateMany?: CreatePostUpdateManyWithWhereWithoutClubInput | CreatePostUpdateManyWithWhereWithoutClubInput[]
    deleteMany?: CreatePostScalarWhereInput | CreatePostScalarWhereInput[]
  }

  export type UserUpdateManyWithoutClubNestedInput = {
    create?: XOR<UserCreateWithoutClubInput, UserUncheckedCreateWithoutClubInput> | UserCreateWithoutClubInput[] | UserUncheckedCreateWithoutClubInput[]
    connectOrCreate?: UserCreateOrConnectWithoutClubInput | UserCreateOrConnectWithoutClubInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutClubInput | UserUpsertWithWhereUniqueWithoutClubInput[]
    createMany?: UserCreateManyClubInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutClubInput | UserUpdateWithWhereUniqueWithoutClubInput[]
    updateMany?: UserUpdateManyWithWhereWithoutClubInput | UserUpdateManyWithWhereWithoutClubInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type eventUpdateManyWithoutClubNestedInput = {
    create?: XOR<eventCreateWithoutClubInput, eventUncheckedCreateWithoutClubInput> | eventCreateWithoutClubInput[] | eventUncheckedCreateWithoutClubInput[]
    connectOrCreate?: eventCreateOrConnectWithoutClubInput | eventCreateOrConnectWithoutClubInput[]
    upsert?: eventUpsertWithWhereUniqueWithoutClubInput | eventUpsertWithWhereUniqueWithoutClubInput[]
    createMany?: eventCreateManyClubInputEnvelope
    set?: eventWhereUniqueInput | eventWhereUniqueInput[]
    disconnect?: eventWhereUniqueInput | eventWhereUniqueInput[]
    delete?: eventWhereUniqueInput | eventWhereUniqueInput[]
    connect?: eventWhereUniqueInput | eventWhereUniqueInput[]
    update?: eventUpdateWithWhereUniqueWithoutClubInput | eventUpdateWithWhereUniqueWithoutClubInput[]
    updateMany?: eventUpdateManyWithWhereWithoutClubInput | eventUpdateManyWithWhereWithoutClubInput[]
    deleteMany?: eventScalarWhereInput | eventScalarWhereInput[]
  }

  export type clubAnnouncementUpdateManyWithoutClubNestedInput = {
    create?: XOR<clubAnnouncementCreateWithoutClubInput, clubAnnouncementUncheckedCreateWithoutClubInput> | clubAnnouncementCreateWithoutClubInput[] | clubAnnouncementUncheckedCreateWithoutClubInput[]
    connectOrCreate?: clubAnnouncementCreateOrConnectWithoutClubInput | clubAnnouncementCreateOrConnectWithoutClubInput[]
    upsert?: clubAnnouncementUpsertWithWhereUniqueWithoutClubInput | clubAnnouncementUpsertWithWhereUniqueWithoutClubInput[]
    createMany?: clubAnnouncementCreateManyClubInputEnvelope
    set?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
    disconnect?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
    delete?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
    connect?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
    update?: clubAnnouncementUpdateWithWhereUniqueWithoutClubInput | clubAnnouncementUpdateWithWhereUniqueWithoutClubInput[]
    updateMany?: clubAnnouncementUpdateManyWithWhereWithoutClubInput | clubAnnouncementUpdateManyWithWhereWithoutClubInput[]
    deleteMany?: clubAnnouncementScalarWhereInput | clubAnnouncementScalarWhereInput[]
  }

  export type CreatePostUncheckedUpdateManyWithoutClubNestedInput = {
    create?: XOR<CreatePostCreateWithoutClubInput, CreatePostUncheckedCreateWithoutClubInput> | CreatePostCreateWithoutClubInput[] | CreatePostUncheckedCreateWithoutClubInput[]
    connectOrCreate?: CreatePostCreateOrConnectWithoutClubInput | CreatePostCreateOrConnectWithoutClubInput[]
    upsert?: CreatePostUpsertWithWhereUniqueWithoutClubInput | CreatePostUpsertWithWhereUniqueWithoutClubInput[]
    createMany?: CreatePostCreateManyClubInputEnvelope
    set?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    disconnect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    delete?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    connect?: CreatePostWhereUniqueInput | CreatePostWhereUniqueInput[]
    update?: CreatePostUpdateWithWhereUniqueWithoutClubInput | CreatePostUpdateWithWhereUniqueWithoutClubInput[]
    updateMany?: CreatePostUpdateManyWithWhereWithoutClubInput | CreatePostUpdateManyWithWhereWithoutClubInput[]
    deleteMany?: CreatePostScalarWhereInput | CreatePostScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutClubNestedInput = {
    create?: XOR<UserCreateWithoutClubInput, UserUncheckedCreateWithoutClubInput> | UserCreateWithoutClubInput[] | UserUncheckedCreateWithoutClubInput[]
    connectOrCreate?: UserCreateOrConnectWithoutClubInput | UserCreateOrConnectWithoutClubInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutClubInput | UserUpsertWithWhereUniqueWithoutClubInput[]
    createMany?: UserCreateManyClubInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutClubInput | UserUpdateWithWhereUniqueWithoutClubInput[]
    updateMany?: UserUpdateManyWithWhereWithoutClubInput | UserUpdateManyWithWhereWithoutClubInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type eventUncheckedUpdateManyWithoutClubNestedInput = {
    create?: XOR<eventCreateWithoutClubInput, eventUncheckedCreateWithoutClubInput> | eventCreateWithoutClubInput[] | eventUncheckedCreateWithoutClubInput[]
    connectOrCreate?: eventCreateOrConnectWithoutClubInput | eventCreateOrConnectWithoutClubInput[]
    upsert?: eventUpsertWithWhereUniqueWithoutClubInput | eventUpsertWithWhereUniqueWithoutClubInput[]
    createMany?: eventCreateManyClubInputEnvelope
    set?: eventWhereUniqueInput | eventWhereUniqueInput[]
    disconnect?: eventWhereUniqueInput | eventWhereUniqueInput[]
    delete?: eventWhereUniqueInput | eventWhereUniqueInput[]
    connect?: eventWhereUniqueInput | eventWhereUniqueInput[]
    update?: eventUpdateWithWhereUniqueWithoutClubInput | eventUpdateWithWhereUniqueWithoutClubInput[]
    updateMany?: eventUpdateManyWithWhereWithoutClubInput | eventUpdateManyWithWhereWithoutClubInput[]
    deleteMany?: eventScalarWhereInput | eventScalarWhereInput[]
  }

  export type clubAnnouncementUncheckedUpdateManyWithoutClubNestedInput = {
    create?: XOR<clubAnnouncementCreateWithoutClubInput, clubAnnouncementUncheckedCreateWithoutClubInput> | clubAnnouncementCreateWithoutClubInput[] | clubAnnouncementUncheckedCreateWithoutClubInput[]
    connectOrCreate?: clubAnnouncementCreateOrConnectWithoutClubInput | clubAnnouncementCreateOrConnectWithoutClubInput[]
    upsert?: clubAnnouncementUpsertWithWhereUniqueWithoutClubInput | clubAnnouncementUpsertWithWhereUniqueWithoutClubInput[]
    createMany?: clubAnnouncementCreateManyClubInputEnvelope
    set?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
    disconnect?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
    delete?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
    connect?: clubAnnouncementWhereUniqueInput | clubAnnouncementWhereUniqueInput[]
    update?: clubAnnouncementUpdateWithWhereUniqueWithoutClubInput | clubAnnouncementUpdateWithWhereUniqueWithoutClubInput[]
    updateMany?: clubAnnouncementUpdateManyWithWhereWithoutClubInput | clubAnnouncementUpdateManyWithWhereWithoutClubInput[]
    deleteMany?: clubAnnouncementScalarWhereInput | clubAnnouncementScalarWhereInput[]
  }

  export type clubsCreateNestedOneWithoutPostsInput = {
    create?: XOR<clubsCreateWithoutPostsInput, clubsUncheckedCreateWithoutPostsInput>
    connectOrCreate?: clubsCreateOrConnectWithoutPostsInput
    connect?: clubsWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCreatePostInput = {
    create?: XOR<UserCreateWithoutCreatePostInput, UserUncheckedCreateWithoutCreatePostInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatePostInput
    connect?: UserWhereUniqueInput
  }

  export type PostUpvoteCreateNestedManyWithoutPostInput = {
    create?: XOR<PostUpvoteCreateWithoutPostInput, PostUpvoteUncheckedCreateWithoutPostInput> | PostUpvoteCreateWithoutPostInput[] | PostUpvoteUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostUpvoteCreateOrConnectWithoutPostInput | PostUpvoteCreateOrConnectWithoutPostInput[]
    createMany?: PostUpvoteCreateManyPostInputEnvelope
    connect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
  }

  export type PostDownvoteCreateNestedManyWithoutPostInput = {
    create?: XOR<PostDownvoteCreateWithoutPostInput, PostDownvoteUncheckedCreateWithoutPostInput> | PostDownvoteCreateWithoutPostInput[] | PostDownvoteUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostDownvoteCreateOrConnectWithoutPostInput | PostDownvoteCreateOrConnectWithoutPostInput[]
    createMany?: PostDownvoteCreateManyPostInputEnvelope
    connect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
  }

  export type PostUpvoteUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<PostUpvoteCreateWithoutPostInput, PostUpvoteUncheckedCreateWithoutPostInput> | PostUpvoteCreateWithoutPostInput[] | PostUpvoteUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostUpvoteCreateOrConnectWithoutPostInput | PostUpvoteCreateOrConnectWithoutPostInput[]
    createMany?: PostUpvoteCreateManyPostInputEnvelope
    connect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
  }

  export type PostDownvoteUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<PostDownvoteCreateWithoutPostInput, PostDownvoteUncheckedCreateWithoutPostInput> | PostDownvoteCreateWithoutPostInput[] | PostDownvoteUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostDownvoteCreateOrConnectWithoutPostInput | PostDownvoteCreateOrConnectWithoutPostInput[]
    createMany?: PostDownvoteCreateManyPostInputEnvelope
    connect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type clubsUpdateOneWithoutPostsNestedInput = {
    create?: XOR<clubsCreateWithoutPostsInput, clubsUncheckedCreateWithoutPostsInput>
    connectOrCreate?: clubsCreateOrConnectWithoutPostsInput
    upsert?: clubsUpsertWithoutPostsInput
    disconnect?: clubsWhereInput | boolean
    delete?: clubsWhereInput | boolean
    connect?: clubsWhereUniqueInput
    update?: XOR<XOR<clubsUpdateToOneWithWhereWithoutPostsInput, clubsUpdateWithoutPostsInput>, clubsUncheckedUpdateWithoutPostsInput>
  }

  export type UserUpdateOneRequiredWithoutCreatePostNestedInput = {
    create?: XOR<UserCreateWithoutCreatePostInput, UserUncheckedCreateWithoutCreatePostInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatePostInput
    upsert?: UserUpsertWithoutCreatePostInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatePostInput, UserUpdateWithoutCreatePostInput>, UserUncheckedUpdateWithoutCreatePostInput>
  }

  export type PostUpvoteUpdateManyWithoutPostNestedInput = {
    create?: XOR<PostUpvoteCreateWithoutPostInput, PostUpvoteUncheckedCreateWithoutPostInput> | PostUpvoteCreateWithoutPostInput[] | PostUpvoteUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostUpvoteCreateOrConnectWithoutPostInput | PostUpvoteCreateOrConnectWithoutPostInput[]
    upsert?: PostUpvoteUpsertWithWhereUniqueWithoutPostInput | PostUpvoteUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: PostUpvoteCreateManyPostInputEnvelope
    set?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    disconnect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    delete?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    connect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    update?: PostUpvoteUpdateWithWhereUniqueWithoutPostInput | PostUpvoteUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: PostUpvoteUpdateManyWithWhereWithoutPostInput | PostUpvoteUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: PostUpvoteScalarWhereInput | PostUpvoteScalarWhereInput[]
  }

  export type PostDownvoteUpdateManyWithoutPostNestedInput = {
    create?: XOR<PostDownvoteCreateWithoutPostInput, PostDownvoteUncheckedCreateWithoutPostInput> | PostDownvoteCreateWithoutPostInput[] | PostDownvoteUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostDownvoteCreateOrConnectWithoutPostInput | PostDownvoteCreateOrConnectWithoutPostInput[]
    upsert?: PostDownvoteUpsertWithWhereUniqueWithoutPostInput | PostDownvoteUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: PostDownvoteCreateManyPostInputEnvelope
    set?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    disconnect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    delete?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    connect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    update?: PostDownvoteUpdateWithWhereUniqueWithoutPostInput | PostDownvoteUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: PostDownvoteUpdateManyWithWhereWithoutPostInput | PostDownvoteUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: PostDownvoteScalarWhereInput | PostDownvoteScalarWhereInput[]
  }

  export type PostUpvoteUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<PostUpvoteCreateWithoutPostInput, PostUpvoteUncheckedCreateWithoutPostInput> | PostUpvoteCreateWithoutPostInput[] | PostUpvoteUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostUpvoteCreateOrConnectWithoutPostInput | PostUpvoteCreateOrConnectWithoutPostInput[]
    upsert?: PostUpvoteUpsertWithWhereUniqueWithoutPostInput | PostUpvoteUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: PostUpvoteCreateManyPostInputEnvelope
    set?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    disconnect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    delete?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    connect?: PostUpvoteWhereUniqueInput | PostUpvoteWhereUniqueInput[]
    update?: PostUpvoteUpdateWithWhereUniqueWithoutPostInput | PostUpvoteUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: PostUpvoteUpdateManyWithWhereWithoutPostInput | PostUpvoteUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: PostUpvoteScalarWhereInput | PostUpvoteScalarWhereInput[]
  }

  export type PostDownvoteUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<PostDownvoteCreateWithoutPostInput, PostDownvoteUncheckedCreateWithoutPostInput> | PostDownvoteCreateWithoutPostInput[] | PostDownvoteUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostDownvoteCreateOrConnectWithoutPostInput | PostDownvoteCreateOrConnectWithoutPostInput[]
    upsert?: PostDownvoteUpsertWithWhereUniqueWithoutPostInput | PostDownvoteUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: PostDownvoteCreateManyPostInputEnvelope
    set?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    disconnect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    delete?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    connect?: PostDownvoteWhereUniqueInput | PostDownvoteWhereUniqueInput[]
    update?: PostDownvoteUpdateWithWhereUniqueWithoutPostInput | PostDownvoteUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: PostDownvoteUpdateManyWithWhereWithoutPostInput | PostDownvoteUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: PostDownvoteScalarWhereInput | PostDownvoteScalarWhereInput[]
  }

  export type eventCreateNestedOneWithoutSpeakersInput = {
    create?: XOR<eventCreateWithoutSpeakersInput, eventUncheckedCreateWithoutSpeakersInput>
    connectOrCreate?: eventCreateOrConnectWithoutSpeakersInput
    connect?: eventWhereUniqueInput
  }

  export type eventUpdateOneRequiredWithoutSpeakersNestedInput = {
    create?: XOR<eventCreateWithoutSpeakersInput, eventUncheckedCreateWithoutSpeakersInput>
    connectOrCreate?: eventCreateOrConnectWithoutSpeakersInput
    upsert?: eventUpsertWithoutSpeakersInput
    connect?: eventWhereUniqueInput
    update?: XOR<XOR<eventUpdateToOneWithWhereWithoutSpeakersInput, eventUpdateWithoutSpeakersInput>, eventUncheckedUpdateWithoutSpeakersInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type clubsCreateNestedOneWithoutEventsInput = {
    create?: XOR<clubsCreateWithoutEventsInput, clubsUncheckedCreateWithoutEventsInput>
    connectOrCreate?: clubsCreateOrConnectWithoutEventsInput
    connect?: clubsWhereUniqueInput
  }

  export type speakersCreateNestedManyWithoutEventInput = {
    create?: XOR<speakersCreateWithoutEventInput, speakersUncheckedCreateWithoutEventInput> | speakersCreateWithoutEventInput[] | speakersUncheckedCreateWithoutEventInput[]
    connectOrCreate?: speakersCreateOrConnectWithoutEventInput | speakersCreateOrConnectWithoutEventInput[]
    createMany?: speakersCreateManyEventInputEnvelope
    connect?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
  }

  export type userEventsCreateNestedManyWithoutEventInput = {
    create?: XOR<userEventsCreateWithoutEventInput, userEventsUncheckedCreateWithoutEventInput> | userEventsCreateWithoutEventInput[] | userEventsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: userEventsCreateOrConnectWithoutEventInput | userEventsCreateOrConnectWithoutEventInput[]
    createMany?: userEventsCreateManyEventInputEnvelope
    connect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
  }

  export type eventAnnouncementCreateNestedManyWithoutEventInput = {
    create?: XOR<eventAnnouncementCreateWithoutEventInput, eventAnnouncementUncheckedCreateWithoutEventInput> | eventAnnouncementCreateWithoutEventInput[] | eventAnnouncementUncheckedCreateWithoutEventInput[]
    connectOrCreate?: eventAnnouncementCreateOrConnectWithoutEventInput | eventAnnouncementCreateOrConnectWithoutEventInput[]
    createMany?: eventAnnouncementCreateManyEventInputEnvelope
    connect?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
  }

  export type eventGalleryCreateNestedManyWithoutEventInput = {
    create?: XOR<eventGalleryCreateWithoutEventInput, eventGalleryUncheckedCreateWithoutEventInput> | eventGalleryCreateWithoutEventInput[] | eventGalleryUncheckedCreateWithoutEventInput[]
    connectOrCreate?: eventGalleryCreateOrConnectWithoutEventInput | eventGalleryCreateOrConnectWithoutEventInput[]
    createMany?: eventGalleryCreateManyEventInputEnvelope
    connect?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
  }

  export type speakersUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<speakersCreateWithoutEventInput, speakersUncheckedCreateWithoutEventInput> | speakersCreateWithoutEventInput[] | speakersUncheckedCreateWithoutEventInput[]
    connectOrCreate?: speakersCreateOrConnectWithoutEventInput | speakersCreateOrConnectWithoutEventInput[]
    createMany?: speakersCreateManyEventInputEnvelope
    connect?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
  }

  export type userEventsUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<userEventsCreateWithoutEventInput, userEventsUncheckedCreateWithoutEventInput> | userEventsCreateWithoutEventInput[] | userEventsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: userEventsCreateOrConnectWithoutEventInput | userEventsCreateOrConnectWithoutEventInput[]
    createMany?: userEventsCreateManyEventInputEnvelope
    connect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
  }

  export type eventAnnouncementUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<eventAnnouncementCreateWithoutEventInput, eventAnnouncementUncheckedCreateWithoutEventInput> | eventAnnouncementCreateWithoutEventInput[] | eventAnnouncementUncheckedCreateWithoutEventInput[]
    connectOrCreate?: eventAnnouncementCreateOrConnectWithoutEventInput | eventAnnouncementCreateOrConnectWithoutEventInput[]
    createMany?: eventAnnouncementCreateManyEventInputEnvelope
    connect?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
  }

  export type eventGalleryUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<eventGalleryCreateWithoutEventInput, eventGalleryUncheckedCreateWithoutEventInput> | eventGalleryCreateWithoutEventInput[] | eventGalleryUncheckedCreateWithoutEventInput[]
    connectOrCreate?: eventGalleryCreateOrConnectWithoutEventInput | eventGalleryCreateOrConnectWithoutEventInput[]
    createMany?: eventGalleryCreateManyEventInputEnvelope
    connect?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
  }

  export type clubsUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<clubsCreateWithoutEventsInput, clubsUncheckedCreateWithoutEventsInput>
    connectOrCreate?: clubsCreateOrConnectWithoutEventsInput
    upsert?: clubsUpsertWithoutEventsInput
    connect?: clubsWhereUniqueInput
    update?: XOR<XOR<clubsUpdateToOneWithWhereWithoutEventsInput, clubsUpdateWithoutEventsInput>, clubsUncheckedUpdateWithoutEventsInput>
  }

  export type speakersUpdateManyWithoutEventNestedInput = {
    create?: XOR<speakersCreateWithoutEventInput, speakersUncheckedCreateWithoutEventInput> | speakersCreateWithoutEventInput[] | speakersUncheckedCreateWithoutEventInput[]
    connectOrCreate?: speakersCreateOrConnectWithoutEventInput | speakersCreateOrConnectWithoutEventInput[]
    upsert?: speakersUpsertWithWhereUniqueWithoutEventInput | speakersUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: speakersCreateManyEventInputEnvelope
    set?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
    disconnect?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
    delete?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
    connect?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
    update?: speakersUpdateWithWhereUniqueWithoutEventInput | speakersUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: speakersUpdateManyWithWhereWithoutEventInput | speakersUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: speakersScalarWhereInput | speakersScalarWhereInput[]
  }

  export type userEventsUpdateManyWithoutEventNestedInput = {
    create?: XOR<userEventsCreateWithoutEventInput, userEventsUncheckedCreateWithoutEventInput> | userEventsCreateWithoutEventInput[] | userEventsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: userEventsCreateOrConnectWithoutEventInput | userEventsCreateOrConnectWithoutEventInput[]
    upsert?: userEventsUpsertWithWhereUniqueWithoutEventInput | userEventsUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: userEventsCreateManyEventInputEnvelope
    set?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    disconnect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    delete?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    connect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    update?: userEventsUpdateWithWhereUniqueWithoutEventInput | userEventsUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: userEventsUpdateManyWithWhereWithoutEventInput | userEventsUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: userEventsScalarWhereInput | userEventsScalarWhereInput[]
  }

  export type eventAnnouncementUpdateManyWithoutEventNestedInput = {
    create?: XOR<eventAnnouncementCreateWithoutEventInput, eventAnnouncementUncheckedCreateWithoutEventInput> | eventAnnouncementCreateWithoutEventInput[] | eventAnnouncementUncheckedCreateWithoutEventInput[]
    connectOrCreate?: eventAnnouncementCreateOrConnectWithoutEventInput | eventAnnouncementCreateOrConnectWithoutEventInput[]
    upsert?: eventAnnouncementUpsertWithWhereUniqueWithoutEventInput | eventAnnouncementUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: eventAnnouncementCreateManyEventInputEnvelope
    set?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
    disconnect?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
    delete?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
    connect?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
    update?: eventAnnouncementUpdateWithWhereUniqueWithoutEventInput | eventAnnouncementUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: eventAnnouncementUpdateManyWithWhereWithoutEventInput | eventAnnouncementUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: eventAnnouncementScalarWhereInput | eventAnnouncementScalarWhereInput[]
  }

  export type eventGalleryUpdateManyWithoutEventNestedInput = {
    create?: XOR<eventGalleryCreateWithoutEventInput, eventGalleryUncheckedCreateWithoutEventInput> | eventGalleryCreateWithoutEventInput[] | eventGalleryUncheckedCreateWithoutEventInput[]
    connectOrCreate?: eventGalleryCreateOrConnectWithoutEventInput | eventGalleryCreateOrConnectWithoutEventInput[]
    upsert?: eventGalleryUpsertWithWhereUniqueWithoutEventInput | eventGalleryUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: eventGalleryCreateManyEventInputEnvelope
    set?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
    disconnect?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
    delete?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
    connect?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
    update?: eventGalleryUpdateWithWhereUniqueWithoutEventInput | eventGalleryUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: eventGalleryUpdateManyWithWhereWithoutEventInput | eventGalleryUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: eventGalleryScalarWhereInput | eventGalleryScalarWhereInput[]
  }

  export type speakersUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<speakersCreateWithoutEventInput, speakersUncheckedCreateWithoutEventInput> | speakersCreateWithoutEventInput[] | speakersUncheckedCreateWithoutEventInput[]
    connectOrCreate?: speakersCreateOrConnectWithoutEventInput | speakersCreateOrConnectWithoutEventInput[]
    upsert?: speakersUpsertWithWhereUniqueWithoutEventInput | speakersUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: speakersCreateManyEventInputEnvelope
    set?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
    disconnect?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
    delete?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
    connect?: speakersWhereUniqueInput | speakersWhereUniqueInput[]
    update?: speakersUpdateWithWhereUniqueWithoutEventInput | speakersUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: speakersUpdateManyWithWhereWithoutEventInput | speakersUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: speakersScalarWhereInput | speakersScalarWhereInput[]
  }

  export type userEventsUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<userEventsCreateWithoutEventInput, userEventsUncheckedCreateWithoutEventInput> | userEventsCreateWithoutEventInput[] | userEventsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: userEventsCreateOrConnectWithoutEventInput | userEventsCreateOrConnectWithoutEventInput[]
    upsert?: userEventsUpsertWithWhereUniqueWithoutEventInput | userEventsUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: userEventsCreateManyEventInputEnvelope
    set?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    disconnect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    delete?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    connect?: userEventsWhereUniqueInput | userEventsWhereUniqueInput[]
    update?: userEventsUpdateWithWhereUniqueWithoutEventInput | userEventsUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: userEventsUpdateManyWithWhereWithoutEventInput | userEventsUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: userEventsScalarWhereInput | userEventsScalarWhereInput[]
  }

  export type eventAnnouncementUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<eventAnnouncementCreateWithoutEventInput, eventAnnouncementUncheckedCreateWithoutEventInput> | eventAnnouncementCreateWithoutEventInput[] | eventAnnouncementUncheckedCreateWithoutEventInput[]
    connectOrCreate?: eventAnnouncementCreateOrConnectWithoutEventInput | eventAnnouncementCreateOrConnectWithoutEventInput[]
    upsert?: eventAnnouncementUpsertWithWhereUniqueWithoutEventInput | eventAnnouncementUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: eventAnnouncementCreateManyEventInputEnvelope
    set?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
    disconnect?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
    delete?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
    connect?: eventAnnouncementWhereUniqueInput | eventAnnouncementWhereUniqueInput[]
    update?: eventAnnouncementUpdateWithWhereUniqueWithoutEventInput | eventAnnouncementUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: eventAnnouncementUpdateManyWithWhereWithoutEventInput | eventAnnouncementUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: eventAnnouncementScalarWhereInput | eventAnnouncementScalarWhereInput[]
  }

  export type eventGalleryUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<eventGalleryCreateWithoutEventInput, eventGalleryUncheckedCreateWithoutEventInput> | eventGalleryCreateWithoutEventInput[] | eventGalleryUncheckedCreateWithoutEventInput[]
    connectOrCreate?: eventGalleryCreateOrConnectWithoutEventInput | eventGalleryCreateOrConnectWithoutEventInput[]
    upsert?: eventGalleryUpsertWithWhereUniqueWithoutEventInput | eventGalleryUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: eventGalleryCreateManyEventInputEnvelope
    set?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
    disconnect?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
    delete?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
    connect?: eventGalleryWhereUniqueInput | eventGalleryWhereUniqueInput[]
    update?: eventGalleryUpdateWithWhereUniqueWithoutEventInput | eventGalleryUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: eventGalleryUpdateManyWithWhereWithoutEventInput | eventGalleryUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: eventGalleryScalarWhereInput | eventGalleryScalarWhereInput[]
  }

  export type eventCreateNestedOneWithoutAnnouncementsInput = {
    create?: XOR<eventCreateWithoutAnnouncementsInput, eventUncheckedCreateWithoutAnnouncementsInput>
    connectOrCreate?: eventCreateOrConnectWithoutAnnouncementsInput
    connect?: eventWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type eventUpdateOneRequiredWithoutAnnouncementsNestedInput = {
    create?: XOR<eventCreateWithoutAnnouncementsInput, eventUncheckedCreateWithoutAnnouncementsInput>
    connectOrCreate?: eventCreateOrConnectWithoutAnnouncementsInput
    upsert?: eventUpsertWithoutAnnouncementsInput
    connect?: eventWhereUniqueInput
    update?: XOR<XOR<eventUpdateToOneWithWhereWithoutAnnouncementsInput, eventUpdateWithoutAnnouncementsInput>, eventUncheckedUpdateWithoutAnnouncementsInput>
  }

  export type eventCreateNestedOneWithoutGalleriesInput = {
    create?: XOR<eventCreateWithoutGalleriesInput, eventUncheckedCreateWithoutGalleriesInput>
    connectOrCreate?: eventCreateOrConnectWithoutGalleriesInput
    connect?: eventWhereUniqueInput
  }

  export type eventUpdateOneRequiredWithoutGalleriesNestedInput = {
    create?: XOR<eventCreateWithoutGalleriesInput, eventUncheckedCreateWithoutGalleriesInput>
    connectOrCreate?: eventCreateOrConnectWithoutGalleriesInput
    upsert?: eventUpsertWithoutGalleriesInput
    connect?: eventWhereUniqueInput
    update?: XOR<XOR<eventUpdateToOneWithWhereWithoutGalleriesInput, eventUpdateWithoutGalleriesInput>, eventUncheckedUpdateWithoutGalleriesInput>
  }

  export type clubsCreateNestedOneWithoutAnnouncementsInput = {
    create?: XOR<clubsCreateWithoutAnnouncementsInput, clubsUncheckedCreateWithoutAnnouncementsInput>
    connectOrCreate?: clubsCreateOrConnectWithoutAnnouncementsInput
    connect?: clubsWhereUniqueInput
  }

  export type clubsUpdateOneRequiredWithoutAnnouncementsNestedInput = {
    create?: XOR<clubsCreateWithoutAnnouncementsInput, clubsUncheckedCreateWithoutAnnouncementsInput>
    connectOrCreate?: clubsCreateOrConnectWithoutAnnouncementsInput
    upsert?: clubsUpsertWithoutAnnouncementsInput
    connect?: clubsWhereUniqueInput
    update?: XOR<XOR<clubsUpdateToOneWithWhereWithoutAnnouncementsInput, clubsUpdateWithoutAnnouncementsInput>, clubsUncheckedUpdateWithoutAnnouncementsInput>
  }

  export type UserCreateNestedOneWithoutEventAttendedInput = {
    create?: XOR<UserCreateWithoutEventAttendedInput, UserUncheckedCreateWithoutEventAttendedInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventAttendedInput
    connect?: UserWhereUniqueInput
  }

  export type eventCreateNestedOneWithoutAttendeesInput = {
    create?: XOR<eventCreateWithoutAttendeesInput, eventUncheckedCreateWithoutAttendeesInput>
    connectOrCreate?: eventCreateOrConnectWithoutAttendeesInput
    connect?: eventWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutEventAttendedNestedInput = {
    create?: XOR<UserCreateWithoutEventAttendedInput, UserUncheckedCreateWithoutEventAttendedInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventAttendedInput
    upsert?: UserUpsertWithoutEventAttendedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEventAttendedInput, UserUpdateWithoutEventAttendedInput>, UserUncheckedUpdateWithoutEventAttendedInput>
  }

  export type eventUpdateOneRequiredWithoutAttendeesNestedInput = {
    create?: XOR<eventCreateWithoutAttendeesInput, eventUncheckedCreateWithoutAttendeesInput>
    connectOrCreate?: eventCreateOrConnectWithoutAttendeesInput
    upsert?: eventUpsertWithoutAttendeesInput
    connect?: eventWhereUniqueInput
    update?: XOR<XOR<eventUpdateToOneWithWhereWithoutAttendeesInput, eventUpdateWithoutAttendeesInput>, eventUncheckedUpdateWithoutAttendeesInput>
  }

  export type CreatePostCreateNestedOneWithoutUpvotesInput = {
    create?: XOR<CreatePostCreateWithoutUpvotesInput, CreatePostUncheckedCreateWithoutUpvotesInput>
    connectOrCreate?: CreatePostCreateOrConnectWithoutUpvotesInput
    connect?: CreatePostWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPostUpvotesInput = {
    create?: XOR<UserCreateWithoutPostUpvotesInput, UserUncheckedCreateWithoutPostUpvotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostUpvotesInput
    connect?: UserWhereUniqueInput
  }

  export type CreatePostUpdateOneRequiredWithoutUpvotesNestedInput = {
    create?: XOR<CreatePostCreateWithoutUpvotesInput, CreatePostUncheckedCreateWithoutUpvotesInput>
    connectOrCreate?: CreatePostCreateOrConnectWithoutUpvotesInput
    upsert?: CreatePostUpsertWithoutUpvotesInput
    connect?: CreatePostWhereUniqueInput
    update?: XOR<XOR<CreatePostUpdateToOneWithWhereWithoutUpvotesInput, CreatePostUpdateWithoutUpvotesInput>, CreatePostUncheckedUpdateWithoutUpvotesInput>
  }

  export type UserUpdateOneRequiredWithoutPostUpvotesNestedInput = {
    create?: XOR<UserCreateWithoutPostUpvotesInput, UserUncheckedCreateWithoutPostUpvotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostUpvotesInput
    upsert?: UserUpsertWithoutPostUpvotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPostUpvotesInput, UserUpdateWithoutPostUpvotesInput>, UserUncheckedUpdateWithoutPostUpvotesInput>
  }

  export type CreatePostCreateNestedOneWithoutDownvotesInput = {
    create?: XOR<CreatePostCreateWithoutDownvotesInput, CreatePostUncheckedCreateWithoutDownvotesInput>
    connectOrCreate?: CreatePostCreateOrConnectWithoutDownvotesInput
    connect?: CreatePostWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPostDownvotesInput = {
    create?: XOR<UserCreateWithoutPostDownvotesInput, UserUncheckedCreateWithoutPostDownvotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostDownvotesInput
    connect?: UserWhereUniqueInput
  }

  export type CreatePostUpdateOneRequiredWithoutDownvotesNestedInput = {
    create?: XOR<CreatePostCreateWithoutDownvotesInput, CreatePostUncheckedCreateWithoutDownvotesInput>
    connectOrCreate?: CreatePostCreateOrConnectWithoutDownvotesInput
    upsert?: CreatePostUpsertWithoutDownvotesInput
    connect?: CreatePostWhereUniqueInput
    update?: XOR<XOR<CreatePostUpdateToOneWithWhereWithoutDownvotesInput, CreatePostUpdateWithoutDownvotesInput>, CreatePostUncheckedUpdateWithoutDownvotesInput>
  }

  export type UserUpdateOneRequiredWithoutPostDownvotesNestedInput = {
    create?: XOR<UserCreateWithoutPostDownvotesInput, UserUncheckedCreateWithoutPostDownvotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostDownvotesInput
    upsert?: UserUpsertWithoutPostDownvotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPostDownvotesInput, UserUpdateWithoutPostDownvotesInput>, UserUncheckedUpdateWithoutPostDownvotesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type userEventsCreateWithoutUserInput = {
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
    event: eventCreateNestedOneWithoutAttendeesInput
  }

  export type userEventsUncheckedCreateWithoutUserInput = {
    eventId: string
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
  }

  export type userEventsCreateOrConnectWithoutUserInput = {
    where: userEventsWhereUniqueInput
    create: XOR<userEventsCreateWithoutUserInput, userEventsUncheckedCreateWithoutUserInput>
  }

  export type userEventsCreateManyUserInputEnvelope = {
    data: userEventsCreateManyUserInput | userEventsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type clubsCreateWithoutMembersInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    posts?: CreatePostCreateNestedManyWithoutClubInput
    events?: eventCreateNestedManyWithoutClubInput
    announcements?: clubAnnouncementCreateNestedManyWithoutClubInput
  }

  export type clubsUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    posts?: CreatePostUncheckedCreateNestedManyWithoutClubInput
    events?: eventUncheckedCreateNestedManyWithoutClubInput
    announcements?: clubAnnouncementUncheckedCreateNestedManyWithoutClubInput
  }

  export type clubsCreateOrConnectWithoutMembersInput = {
    where: clubsWhereUniqueInput
    create: XOR<clubsCreateWithoutMembersInput, clubsUncheckedCreateWithoutMembersInput>
  }

  export type CreatePostCreateWithoutAuthorInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    club?: clubsCreateNestedOneWithoutPostsInput
    upvotes?: PostUpvoteCreateNestedManyWithoutPostInput
    downvotes?: PostDownvoteCreateNestedManyWithoutPostInput
  }

  export type CreatePostUncheckedCreateWithoutAuthorInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    collegeId?: string | null
    upvotes?: PostUpvoteUncheckedCreateNestedManyWithoutPostInput
    downvotes?: PostDownvoteUncheckedCreateNestedManyWithoutPostInput
  }

  export type CreatePostCreateOrConnectWithoutAuthorInput = {
    where: CreatePostWhereUniqueInput
    create: XOR<CreatePostCreateWithoutAuthorInput, CreatePostUncheckedCreateWithoutAuthorInput>
  }

  export type CreatePostCreateManyAuthorInputEnvelope = {
    data: CreatePostCreateManyAuthorInput | CreatePostCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type PostUpvoteCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    post: CreatePostCreateNestedOneWithoutUpvotesInput
  }

  export type PostUpvoteUncheckedCreateWithoutUserInput = {
    id?: string
    postId: string
    createdAt?: Date | string
  }

  export type PostUpvoteCreateOrConnectWithoutUserInput = {
    where: PostUpvoteWhereUniqueInput
    create: XOR<PostUpvoteCreateWithoutUserInput, PostUpvoteUncheckedCreateWithoutUserInput>
  }

  export type PostUpvoteCreateManyUserInputEnvelope = {
    data: PostUpvoteCreateManyUserInput | PostUpvoteCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PostDownvoteCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    post: CreatePostCreateNestedOneWithoutDownvotesInput
  }

  export type PostDownvoteUncheckedCreateWithoutUserInput = {
    id?: string
    postId: string
    createdAt?: Date | string
  }

  export type PostDownvoteCreateOrConnectWithoutUserInput = {
    where: PostDownvoteWhereUniqueInput
    create: XOR<PostDownvoteCreateWithoutUserInput, PostDownvoteUncheckedCreateWithoutUserInput>
  }

  export type PostDownvoteCreateManyUserInputEnvelope = {
    data: PostDownvoteCreateManyUserInput | PostDownvoteCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type userEventsUpsertWithWhereUniqueWithoutUserInput = {
    where: userEventsWhereUniqueInput
    update: XOR<userEventsUpdateWithoutUserInput, userEventsUncheckedUpdateWithoutUserInput>
    create: XOR<userEventsCreateWithoutUserInput, userEventsUncheckedCreateWithoutUserInput>
  }

  export type userEventsUpdateWithWhereUniqueWithoutUserInput = {
    where: userEventsWhereUniqueInput
    data: XOR<userEventsUpdateWithoutUserInput, userEventsUncheckedUpdateWithoutUserInput>
  }

  export type userEventsUpdateManyWithWhereWithoutUserInput = {
    where: userEventsScalarWhereInput
    data: XOR<userEventsUpdateManyMutationInput, userEventsUncheckedUpdateManyWithoutUserInput>
  }

  export type userEventsScalarWhereInput = {
    AND?: userEventsScalarWhereInput | userEventsScalarWhereInput[]
    OR?: userEventsScalarWhereInput[]
    NOT?: userEventsScalarWhereInput | userEventsScalarWhereInput[]
    userId?: StringFilter<"userEvents"> | string
    eventId?: StringFilter<"userEvents"> | string
    uniquePassId?: StringNullableFilter<"userEvents"> | string | null
    joinedAt?: DateTimeFilter<"userEvents"> | Date | string
    paymentScreenshotUrl?: StringNullableFilter<"userEvents"> | string | null
    paymentStatus?: StringFilter<"userEvents"> | string
    paymentVerifiedAt?: DateTimeNullableFilter<"userEvents"> | Date | string | null
  }

  export type clubsUpsertWithoutMembersInput = {
    update: XOR<clubsUpdateWithoutMembersInput, clubsUncheckedUpdateWithoutMembersInput>
    create: XOR<clubsCreateWithoutMembersInput, clubsUncheckedCreateWithoutMembersInput>
    where?: clubsWhereInput
  }

  export type clubsUpdateToOneWithWhereWithoutMembersInput = {
    where?: clubsWhereInput
    data: XOR<clubsUpdateWithoutMembersInput, clubsUncheckedUpdateWithoutMembersInput>
  }

  export type clubsUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    posts?: CreatePostUpdateManyWithoutClubNestedInput
    events?: eventUpdateManyWithoutClubNestedInput
    announcements?: clubAnnouncementUpdateManyWithoutClubNestedInput
  }

  export type clubsUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    posts?: CreatePostUncheckedUpdateManyWithoutClubNestedInput
    events?: eventUncheckedUpdateManyWithoutClubNestedInput
    announcements?: clubAnnouncementUncheckedUpdateManyWithoutClubNestedInput
  }

  export type CreatePostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: CreatePostWhereUniqueInput
    update: XOR<CreatePostUpdateWithoutAuthorInput, CreatePostUncheckedUpdateWithoutAuthorInput>
    create: XOR<CreatePostCreateWithoutAuthorInput, CreatePostUncheckedCreateWithoutAuthorInput>
  }

  export type CreatePostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: CreatePostWhereUniqueInput
    data: XOR<CreatePostUpdateWithoutAuthorInput, CreatePostUncheckedUpdateWithoutAuthorInput>
  }

  export type CreatePostUpdateManyWithWhereWithoutAuthorInput = {
    where: CreatePostScalarWhereInput
    data: XOR<CreatePostUpdateManyMutationInput, CreatePostUncheckedUpdateManyWithoutAuthorInput>
  }

  export type CreatePostScalarWhereInput = {
    AND?: CreatePostScalarWhereInput | CreatePostScalarWhereInput[]
    OR?: CreatePostScalarWhereInput[]
    NOT?: CreatePostScalarWhereInput | CreatePostScalarWhereInput[]
    id?: StringFilter<"CreatePost"> | string
    title?: StringFilter<"CreatePost"> | string
    description?: StringFilter<"CreatePost"> | string
    image?: StringNullableFilter<"CreatePost"> | string | null
    createdAt?: DateTimeFilter<"CreatePost"> | Date | string
    updatedAt?: DateTimeFilter<"CreatePost"> | Date | string
    published?: BoolFilter<"CreatePost"> | boolean
    collegeName?: StringFilter<"CreatePost"> | string
    clubName?: StringFilter<"CreatePost"> | string
    collegeId?: StringNullableFilter<"CreatePost"> | string | null
    authorId?: StringFilter<"CreatePost"> | string
  }

  export type PostUpvoteUpsertWithWhereUniqueWithoutUserInput = {
    where: PostUpvoteWhereUniqueInput
    update: XOR<PostUpvoteUpdateWithoutUserInput, PostUpvoteUncheckedUpdateWithoutUserInput>
    create: XOR<PostUpvoteCreateWithoutUserInput, PostUpvoteUncheckedCreateWithoutUserInput>
  }

  export type PostUpvoteUpdateWithWhereUniqueWithoutUserInput = {
    where: PostUpvoteWhereUniqueInput
    data: XOR<PostUpvoteUpdateWithoutUserInput, PostUpvoteUncheckedUpdateWithoutUserInput>
  }

  export type PostUpvoteUpdateManyWithWhereWithoutUserInput = {
    where: PostUpvoteScalarWhereInput
    data: XOR<PostUpvoteUpdateManyMutationInput, PostUpvoteUncheckedUpdateManyWithoutUserInput>
  }

  export type PostUpvoteScalarWhereInput = {
    AND?: PostUpvoteScalarWhereInput | PostUpvoteScalarWhereInput[]
    OR?: PostUpvoteScalarWhereInput[]
    NOT?: PostUpvoteScalarWhereInput | PostUpvoteScalarWhereInput[]
    id?: StringFilter<"PostUpvote"> | string
    postId?: StringFilter<"PostUpvote"> | string
    userId?: StringFilter<"PostUpvote"> | string
    createdAt?: DateTimeFilter<"PostUpvote"> | Date | string
  }

  export type PostDownvoteUpsertWithWhereUniqueWithoutUserInput = {
    where: PostDownvoteWhereUniqueInput
    update: XOR<PostDownvoteUpdateWithoutUserInput, PostDownvoteUncheckedUpdateWithoutUserInput>
    create: XOR<PostDownvoteCreateWithoutUserInput, PostDownvoteUncheckedCreateWithoutUserInput>
  }

  export type PostDownvoteUpdateWithWhereUniqueWithoutUserInput = {
    where: PostDownvoteWhereUniqueInput
    data: XOR<PostDownvoteUpdateWithoutUserInput, PostDownvoteUncheckedUpdateWithoutUserInput>
  }

  export type PostDownvoteUpdateManyWithWhereWithoutUserInput = {
    where: PostDownvoteScalarWhereInput
    data: XOR<PostDownvoteUpdateManyMutationInput, PostDownvoteUncheckedUpdateManyWithoutUserInput>
  }

  export type PostDownvoteScalarWhereInput = {
    AND?: PostDownvoteScalarWhereInput | PostDownvoteScalarWhereInput[]
    OR?: PostDownvoteScalarWhereInput[]
    NOT?: PostDownvoteScalarWhereInput | PostDownvoteScalarWhereInput[]
    id?: StringFilter<"PostDownvote"> | string
    postId?: StringFilter<"PostDownvote"> | string
    userId?: StringFilter<"PostDownvote"> | string
    createdAt?: DateTimeFilter<"PostDownvote"> | Date | string
  }

  export type CreatePostCreateWithoutClubInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    author: UserCreateNestedOneWithoutCreatePostInput
    upvotes?: PostUpvoteCreateNestedManyWithoutPostInput
    downvotes?: PostDownvoteCreateNestedManyWithoutPostInput
  }

  export type CreatePostUncheckedCreateWithoutClubInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    authorId: string
    upvotes?: PostUpvoteUncheckedCreateNestedManyWithoutPostInput
    downvotes?: PostDownvoteUncheckedCreateNestedManyWithoutPostInput
  }

  export type CreatePostCreateOrConnectWithoutClubInput = {
    where: CreatePostWhereUniqueInput
    create: XOR<CreatePostCreateWithoutClubInput, CreatePostUncheckedCreateWithoutClubInput>
  }

  export type CreatePostCreateManyClubInputEnvelope = {
    data: CreatePostCreateManyClubInput | CreatePostCreateManyClubInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutClubInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsCreateNestedManyWithoutUserInput
    CreatePost?: CreatePostCreateNestedManyWithoutAuthorInput
    postUpvotes?: PostUpvoteCreateNestedManyWithoutUserInput
    postDownvotes?: PostDownvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutClubInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsUncheckedCreateNestedManyWithoutUserInput
    CreatePost?: CreatePostUncheckedCreateNestedManyWithoutAuthorInput
    postUpvotes?: PostUpvoteUncheckedCreateNestedManyWithoutUserInput
    postDownvotes?: PostDownvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutClubInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutClubInput, UserUncheckedCreateWithoutClubInput>
  }

  export type UserCreateManyClubInputEnvelope = {
    data: UserCreateManyClubInput | UserCreateManyClubInput[]
    skipDuplicates?: boolean
  }

  export type eventCreateWithoutClubInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    speakers?: speakersCreateNestedManyWithoutEventInput
    attendees?: userEventsCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementCreateNestedManyWithoutEventInput
    galleries?: eventGalleryCreateNestedManyWithoutEventInput
  }

  export type eventUncheckedCreateWithoutClubInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    speakers?: speakersUncheckedCreateNestedManyWithoutEventInput
    attendees?: userEventsUncheckedCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementUncheckedCreateNestedManyWithoutEventInput
    galleries?: eventGalleryUncheckedCreateNestedManyWithoutEventInput
  }

  export type eventCreateOrConnectWithoutClubInput = {
    where: eventWhereUniqueInput
    create: XOR<eventCreateWithoutClubInput, eventUncheckedCreateWithoutClubInput>
  }

  export type eventCreateManyClubInputEnvelope = {
    data: eventCreateManyClubInput | eventCreateManyClubInput[]
    skipDuplicates?: boolean
  }

  export type clubAnnouncementCreateWithoutClubInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type clubAnnouncementUncheckedCreateWithoutClubInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type clubAnnouncementCreateOrConnectWithoutClubInput = {
    where: clubAnnouncementWhereUniqueInput
    create: XOR<clubAnnouncementCreateWithoutClubInput, clubAnnouncementUncheckedCreateWithoutClubInput>
  }

  export type clubAnnouncementCreateManyClubInputEnvelope = {
    data: clubAnnouncementCreateManyClubInput | clubAnnouncementCreateManyClubInput[]
    skipDuplicates?: boolean
  }

  export type CreatePostUpsertWithWhereUniqueWithoutClubInput = {
    where: CreatePostWhereUniqueInput
    update: XOR<CreatePostUpdateWithoutClubInput, CreatePostUncheckedUpdateWithoutClubInput>
    create: XOR<CreatePostCreateWithoutClubInput, CreatePostUncheckedCreateWithoutClubInput>
  }

  export type CreatePostUpdateWithWhereUniqueWithoutClubInput = {
    where: CreatePostWhereUniqueInput
    data: XOR<CreatePostUpdateWithoutClubInput, CreatePostUncheckedUpdateWithoutClubInput>
  }

  export type CreatePostUpdateManyWithWhereWithoutClubInput = {
    where: CreatePostScalarWhereInput
    data: XOR<CreatePostUpdateManyMutationInput, CreatePostUncheckedUpdateManyWithoutClubInput>
  }

  export type UserUpsertWithWhereUniqueWithoutClubInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutClubInput, UserUncheckedUpdateWithoutClubInput>
    create: XOR<UserCreateWithoutClubInput, UserUncheckedCreateWithoutClubInput>
  }

  export type UserUpdateWithWhereUniqueWithoutClubInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutClubInput, UserUncheckedUpdateWithoutClubInput>
  }

  export type UserUpdateManyWithWhereWithoutClubInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutClubInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    clerkId?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    collegeName?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    profileAvatar?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    vToken?: StringNullableFilter<"User"> | string | null
    expiryToken?: IntNullableFilter<"User"> | number | null
    ValidFor?: IntNullableFilter<"User"> | number | null
    isVerified?: BoolNullableFilter<"User"> | boolean | null
    clubName?: StringNullableFilter<"User"> | string | null
    clubId?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    tags?: StringNullableListFilter<"User">
    course?: StringNullableFilter<"User"> | string | null
    year?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    twitter?: StringNullableFilter<"User"> | string | null
    linkedin?: StringNullableFilter<"User"> | string | null
    instagram?: StringNullableFilter<"User"> | string | null
  }

  export type eventUpsertWithWhereUniqueWithoutClubInput = {
    where: eventWhereUniqueInput
    update: XOR<eventUpdateWithoutClubInput, eventUncheckedUpdateWithoutClubInput>
    create: XOR<eventCreateWithoutClubInput, eventUncheckedCreateWithoutClubInput>
  }

  export type eventUpdateWithWhereUniqueWithoutClubInput = {
    where: eventWhereUniqueInput
    data: XOR<eventUpdateWithoutClubInput, eventUncheckedUpdateWithoutClubInput>
  }

  export type eventUpdateManyWithWhereWithoutClubInput = {
    where: eventScalarWhereInput
    data: XOR<eventUpdateManyMutationInput, eventUncheckedUpdateManyWithoutClubInput>
  }

  export type eventScalarWhereInput = {
    AND?: eventScalarWhereInput | eventScalarWhereInput[]
    OR?: eventScalarWhereInput[]
    NOT?: eventScalarWhereInput | eventScalarWhereInput[]
    id?: StringFilter<"event"> | string
    posterUrl?: StringNullableFilter<"event"> | string | null
    EventMode?: StringFilter<"event"> | string
    EventType?: StringFilter<"event"> | string
    eventHeaderImage?: StringNullableFilter<"event"> | string | null
    EventName?: StringFilter<"event"> | string
    description?: StringFilter<"event"> | string
    tagline?: StringNullableFilter<"event"> | string | null
    prizes?: StringFilter<"event"> | string
    TeamSize?: IntFilter<"event"> | number
    Venue?: StringFilter<"event"> | string
    EventUrl?: StringNullableFilter<"event"> | string | null
    applicationStatus?: StringFilter<"event"> | string
    applicationStartDate?: StringNullableFilter<"event"> | string | null
    applicationEndDate?: StringNullableFilter<"event"> | string | null
    clubName?: StringFilter<"event"> | string
    clubId?: StringFilter<"event"> | string
    university?: StringFilter<"event"> | string
    createdAt?: DateTimeFilter<"event"> | Date | string
    startDate?: StringFilter<"event"> | string
    endDate?: StringNullableFilter<"event"> | string | null
    collegeStudentsOnly?: BoolFilter<"event"> | boolean
    participationFee?: BoolFilter<"event"> | boolean
    contactEmail?: StringFilter<"event"> | string
    contactPhone?: StringNullableFilter<"event"> | string | null
    Form?: StringNullableFilter<"event"> | string | null
    Fees?: StringNullableFilter<"event"> | string | null
    link1?: StringNullableFilter<"event"> | string | null
    link2?: StringNullableFilter<"event"> | string | null
    link3?: StringNullableFilter<"event"> | string | null
    whatsappLink?: StringNullableFilter<"event"> | string | null
    isPaid?: BoolFilter<"event"> | boolean
    qrCodeUrl?: StringNullableFilter<"event"> | string | null
  }

  export type clubAnnouncementUpsertWithWhereUniqueWithoutClubInput = {
    where: clubAnnouncementWhereUniqueInput
    update: XOR<clubAnnouncementUpdateWithoutClubInput, clubAnnouncementUncheckedUpdateWithoutClubInput>
    create: XOR<clubAnnouncementCreateWithoutClubInput, clubAnnouncementUncheckedCreateWithoutClubInput>
  }

  export type clubAnnouncementUpdateWithWhereUniqueWithoutClubInput = {
    where: clubAnnouncementWhereUniqueInput
    data: XOR<clubAnnouncementUpdateWithoutClubInput, clubAnnouncementUncheckedUpdateWithoutClubInput>
  }

  export type clubAnnouncementUpdateManyWithWhereWithoutClubInput = {
    where: clubAnnouncementScalarWhereInput
    data: XOR<clubAnnouncementUpdateManyMutationInput, clubAnnouncementUncheckedUpdateManyWithoutClubInput>
  }

  export type clubAnnouncementScalarWhereInput = {
    AND?: clubAnnouncementScalarWhereInput | clubAnnouncementScalarWhereInput[]
    OR?: clubAnnouncementScalarWhereInput[]
    NOT?: clubAnnouncementScalarWhereInput | clubAnnouncementScalarWhereInput[]
    id?: StringFilter<"clubAnnouncement"> | string
    Title?: StringFilter<"clubAnnouncement"> | string
    Description?: StringFilter<"clubAnnouncement"> | string
    createdAt?: DateTimeFilter<"clubAnnouncement"> | Date | string
    updatedAt?: DateTimeNullableFilter<"clubAnnouncement"> | Date | string | null
    clubId?: StringFilter<"clubAnnouncement"> | string
  }

  export type clubsCreateWithoutPostsInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    members?: UserCreateNestedManyWithoutClubInput
    events?: eventCreateNestedManyWithoutClubInput
    announcements?: clubAnnouncementCreateNestedManyWithoutClubInput
  }

  export type clubsUncheckedCreateWithoutPostsInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    members?: UserUncheckedCreateNestedManyWithoutClubInput
    events?: eventUncheckedCreateNestedManyWithoutClubInput
    announcements?: clubAnnouncementUncheckedCreateNestedManyWithoutClubInput
  }

  export type clubsCreateOrConnectWithoutPostsInput = {
    where: clubsWhereUniqueInput
    create: XOR<clubsCreateWithoutPostsInput, clubsUncheckedCreateWithoutPostsInput>
  }

  export type UserCreateWithoutCreatePostInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsCreateNestedManyWithoutUserInput
    club?: clubsCreateNestedOneWithoutMembersInput
    postUpvotes?: PostUpvoteCreateNestedManyWithoutUserInput
    postDownvotes?: PostDownvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatePostInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    clubId?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsUncheckedCreateNestedManyWithoutUserInput
    postUpvotes?: PostUpvoteUncheckedCreateNestedManyWithoutUserInput
    postDownvotes?: PostDownvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatePostInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatePostInput, UserUncheckedCreateWithoutCreatePostInput>
  }

  export type PostUpvoteCreateWithoutPostInput = {
    id?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPostUpvotesInput
  }

  export type PostUpvoteUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type PostUpvoteCreateOrConnectWithoutPostInput = {
    where: PostUpvoteWhereUniqueInput
    create: XOR<PostUpvoteCreateWithoutPostInput, PostUpvoteUncheckedCreateWithoutPostInput>
  }

  export type PostUpvoteCreateManyPostInputEnvelope = {
    data: PostUpvoteCreateManyPostInput | PostUpvoteCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type PostDownvoteCreateWithoutPostInput = {
    id?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPostDownvotesInput
  }

  export type PostDownvoteUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type PostDownvoteCreateOrConnectWithoutPostInput = {
    where: PostDownvoteWhereUniqueInput
    create: XOR<PostDownvoteCreateWithoutPostInput, PostDownvoteUncheckedCreateWithoutPostInput>
  }

  export type PostDownvoteCreateManyPostInputEnvelope = {
    data: PostDownvoteCreateManyPostInput | PostDownvoteCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type clubsUpsertWithoutPostsInput = {
    update: XOR<clubsUpdateWithoutPostsInput, clubsUncheckedUpdateWithoutPostsInput>
    create: XOR<clubsCreateWithoutPostsInput, clubsUncheckedCreateWithoutPostsInput>
    where?: clubsWhereInput
  }

  export type clubsUpdateToOneWithWhereWithoutPostsInput = {
    where?: clubsWhereInput
    data: XOR<clubsUpdateWithoutPostsInput, clubsUncheckedUpdateWithoutPostsInput>
  }

  export type clubsUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    members?: UserUpdateManyWithoutClubNestedInput
    events?: eventUpdateManyWithoutClubNestedInput
    announcements?: clubAnnouncementUpdateManyWithoutClubNestedInput
  }

  export type clubsUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    members?: UserUncheckedUpdateManyWithoutClubNestedInput
    events?: eventUncheckedUpdateManyWithoutClubNestedInput
    announcements?: clubAnnouncementUncheckedUpdateManyWithoutClubNestedInput
  }

  export type UserUpsertWithoutCreatePostInput = {
    update: XOR<UserUpdateWithoutCreatePostInput, UserUncheckedUpdateWithoutCreatePostInput>
    create: XOR<UserCreateWithoutCreatePostInput, UserUncheckedCreateWithoutCreatePostInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatePostInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatePostInput, UserUncheckedUpdateWithoutCreatePostInput>
  }

  export type UserUpdateWithoutCreatePostInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUpdateManyWithoutUserNestedInput
    club?: clubsUpdateOneWithoutMembersNestedInput
    postUpvotes?: PostUpvoteUpdateManyWithoutUserNestedInput
    postDownvotes?: PostDownvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatePostInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUncheckedUpdateManyWithoutUserNestedInput
    postUpvotes?: PostUpvoteUncheckedUpdateManyWithoutUserNestedInput
    postDownvotes?: PostDownvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PostUpvoteUpsertWithWhereUniqueWithoutPostInput = {
    where: PostUpvoteWhereUniqueInput
    update: XOR<PostUpvoteUpdateWithoutPostInput, PostUpvoteUncheckedUpdateWithoutPostInput>
    create: XOR<PostUpvoteCreateWithoutPostInput, PostUpvoteUncheckedCreateWithoutPostInput>
  }

  export type PostUpvoteUpdateWithWhereUniqueWithoutPostInput = {
    where: PostUpvoteWhereUniqueInput
    data: XOR<PostUpvoteUpdateWithoutPostInput, PostUpvoteUncheckedUpdateWithoutPostInput>
  }

  export type PostUpvoteUpdateManyWithWhereWithoutPostInput = {
    where: PostUpvoteScalarWhereInput
    data: XOR<PostUpvoteUpdateManyMutationInput, PostUpvoteUncheckedUpdateManyWithoutPostInput>
  }

  export type PostDownvoteUpsertWithWhereUniqueWithoutPostInput = {
    where: PostDownvoteWhereUniqueInput
    update: XOR<PostDownvoteUpdateWithoutPostInput, PostDownvoteUncheckedUpdateWithoutPostInput>
    create: XOR<PostDownvoteCreateWithoutPostInput, PostDownvoteUncheckedCreateWithoutPostInput>
  }

  export type PostDownvoteUpdateWithWhereUniqueWithoutPostInput = {
    where: PostDownvoteWhereUniqueInput
    data: XOR<PostDownvoteUpdateWithoutPostInput, PostDownvoteUncheckedUpdateWithoutPostInput>
  }

  export type PostDownvoteUpdateManyWithWhereWithoutPostInput = {
    where: PostDownvoteScalarWhereInput
    data: XOR<PostDownvoteUpdateManyMutationInput, PostDownvoteUncheckedUpdateManyWithoutPostInput>
  }

  export type eventCreateWithoutSpeakersInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    club: clubsCreateNestedOneWithoutEventsInput
    attendees?: userEventsCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementCreateNestedManyWithoutEventInput
    galleries?: eventGalleryCreateNestedManyWithoutEventInput
  }

  export type eventUncheckedCreateWithoutSpeakersInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    clubId: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    attendees?: userEventsUncheckedCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementUncheckedCreateNestedManyWithoutEventInput
    galleries?: eventGalleryUncheckedCreateNestedManyWithoutEventInput
  }

  export type eventCreateOrConnectWithoutSpeakersInput = {
    where: eventWhereUniqueInput
    create: XOR<eventCreateWithoutSpeakersInput, eventUncheckedCreateWithoutSpeakersInput>
  }

  export type eventUpsertWithoutSpeakersInput = {
    update: XOR<eventUpdateWithoutSpeakersInput, eventUncheckedUpdateWithoutSpeakersInput>
    create: XOR<eventCreateWithoutSpeakersInput, eventUncheckedCreateWithoutSpeakersInput>
    where?: eventWhereInput
  }

  export type eventUpdateToOneWithWhereWithoutSpeakersInput = {
    where?: eventWhereInput
    data: XOR<eventUpdateWithoutSpeakersInput, eventUncheckedUpdateWithoutSpeakersInput>
  }

  export type eventUpdateWithoutSpeakersInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    club?: clubsUpdateOneRequiredWithoutEventsNestedInput
    attendees?: userEventsUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUpdateManyWithoutEventNestedInput
  }

  export type eventUncheckedUpdateWithoutSpeakersInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    clubId?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    attendees?: userEventsUncheckedUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUncheckedUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUncheckedUpdateManyWithoutEventNestedInput
  }

  export type clubsCreateWithoutEventsInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    posts?: CreatePostCreateNestedManyWithoutClubInput
    members?: UserCreateNestedManyWithoutClubInput
    announcements?: clubAnnouncementCreateNestedManyWithoutClubInput
  }

  export type clubsUncheckedCreateWithoutEventsInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    posts?: CreatePostUncheckedCreateNestedManyWithoutClubInput
    members?: UserUncheckedCreateNestedManyWithoutClubInput
    announcements?: clubAnnouncementUncheckedCreateNestedManyWithoutClubInput
  }

  export type clubsCreateOrConnectWithoutEventsInput = {
    where: clubsWhereUniqueInput
    create: XOR<clubsCreateWithoutEventsInput, clubsUncheckedCreateWithoutEventsInput>
  }

  export type speakersCreateWithoutEventInput = {
    profilePic?: string | null
    about: string
    name: string
    email: string
  }

  export type speakersUncheckedCreateWithoutEventInput = {
    id?: number
    profilePic?: string | null
    about: string
    name: string
    email: string
  }

  export type speakersCreateOrConnectWithoutEventInput = {
    where: speakersWhereUniqueInput
    create: XOR<speakersCreateWithoutEventInput, speakersUncheckedCreateWithoutEventInput>
  }

  export type speakersCreateManyEventInputEnvelope = {
    data: speakersCreateManyEventInput | speakersCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type userEventsCreateWithoutEventInput = {
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
    user: UserCreateNestedOneWithoutEventAttendedInput
  }

  export type userEventsUncheckedCreateWithoutEventInput = {
    userId: string
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
  }

  export type userEventsCreateOrConnectWithoutEventInput = {
    where: userEventsWhereUniqueInput
    create: XOR<userEventsCreateWithoutEventInput, userEventsUncheckedCreateWithoutEventInput>
  }

  export type userEventsCreateManyEventInputEnvelope = {
    data: userEventsCreateManyEventInput | userEventsCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type eventAnnouncementCreateWithoutEventInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type eventAnnouncementUncheckedCreateWithoutEventInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type eventAnnouncementCreateOrConnectWithoutEventInput = {
    where: eventAnnouncementWhereUniqueInput
    create: XOR<eventAnnouncementCreateWithoutEventInput, eventAnnouncementUncheckedCreateWithoutEventInput>
  }

  export type eventAnnouncementCreateManyEventInputEnvelope = {
    data: eventAnnouncementCreateManyEventInput | eventAnnouncementCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type eventGalleryCreateWithoutEventInput = {
    id?: string
    imageUrl: string
    caption?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type eventGalleryUncheckedCreateWithoutEventInput = {
    id?: string
    imageUrl: string
    caption?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type eventGalleryCreateOrConnectWithoutEventInput = {
    where: eventGalleryWhereUniqueInput
    create: XOR<eventGalleryCreateWithoutEventInput, eventGalleryUncheckedCreateWithoutEventInput>
  }

  export type eventGalleryCreateManyEventInputEnvelope = {
    data: eventGalleryCreateManyEventInput | eventGalleryCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type clubsUpsertWithoutEventsInput = {
    update: XOR<clubsUpdateWithoutEventsInput, clubsUncheckedUpdateWithoutEventsInput>
    create: XOR<clubsCreateWithoutEventsInput, clubsUncheckedCreateWithoutEventsInput>
    where?: clubsWhereInput
  }

  export type clubsUpdateToOneWithWhereWithoutEventsInput = {
    where?: clubsWhereInput
    data: XOR<clubsUpdateWithoutEventsInput, clubsUncheckedUpdateWithoutEventsInput>
  }

  export type clubsUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    posts?: CreatePostUpdateManyWithoutClubNestedInput
    members?: UserUpdateManyWithoutClubNestedInput
    announcements?: clubAnnouncementUpdateManyWithoutClubNestedInput
  }

  export type clubsUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    posts?: CreatePostUncheckedUpdateManyWithoutClubNestedInput
    members?: UserUncheckedUpdateManyWithoutClubNestedInput
    announcements?: clubAnnouncementUncheckedUpdateManyWithoutClubNestedInput
  }

  export type speakersUpsertWithWhereUniqueWithoutEventInput = {
    where: speakersWhereUniqueInput
    update: XOR<speakersUpdateWithoutEventInput, speakersUncheckedUpdateWithoutEventInput>
    create: XOR<speakersCreateWithoutEventInput, speakersUncheckedCreateWithoutEventInput>
  }

  export type speakersUpdateWithWhereUniqueWithoutEventInput = {
    where: speakersWhereUniqueInput
    data: XOR<speakersUpdateWithoutEventInput, speakersUncheckedUpdateWithoutEventInput>
  }

  export type speakersUpdateManyWithWhereWithoutEventInput = {
    where: speakersScalarWhereInput
    data: XOR<speakersUpdateManyMutationInput, speakersUncheckedUpdateManyWithoutEventInput>
  }

  export type speakersScalarWhereInput = {
    AND?: speakersScalarWhereInput | speakersScalarWhereInput[]
    OR?: speakersScalarWhereInput[]
    NOT?: speakersScalarWhereInput | speakersScalarWhereInput[]
    id?: IntFilter<"speakers"> | number
    profilePic?: StringNullableFilter<"speakers"> | string | null
    about?: StringFilter<"speakers"> | string
    name?: StringFilter<"speakers"> | string
    email?: StringFilter<"speakers"> | string
    eventId?: StringFilter<"speakers"> | string
  }

  export type userEventsUpsertWithWhereUniqueWithoutEventInput = {
    where: userEventsWhereUniqueInput
    update: XOR<userEventsUpdateWithoutEventInput, userEventsUncheckedUpdateWithoutEventInput>
    create: XOR<userEventsCreateWithoutEventInput, userEventsUncheckedCreateWithoutEventInput>
  }

  export type userEventsUpdateWithWhereUniqueWithoutEventInput = {
    where: userEventsWhereUniqueInput
    data: XOR<userEventsUpdateWithoutEventInput, userEventsUncheckedUpdateWithoutEventInput>
  }

  export type userEventsUpdateManyWithWhereWithoutEventInput = {
    where: userEventsScalarWhereInput
    data: XOR<userEventsUpdateManyMutationInput, userEventsUncheckedUpdateManyWithoutEventInput>
  }

  export type eventAnnouncementUpsertWithWhereUniqueWithoutEventInput = {
    where: eventAnnouncementWhereUniqueInput
    update: XOR<eventAnnouncementUpdateWithoutEventInput, eventAnnouncementUncheckedUpdateWithoutEventInput>
    create: XOR<eventAnnouncementCreateWithoutEventInput, eventAnnouncementUncheckedCreateWithoutEventInput>
  }

  export type eventAnnouncementUpdateWithWhereUniqueWithoutEventInput = {
    where: eventAnnouncementWhereUniqueInput
    data: XOR<eventAnnouncementUpdateWithoutEventInput, eventAnnouncementUncheckedUpdateWithoutEventInput>
  }

  export type eventAnnouncementUpdateManyWithWhereWithoutEventInput = {
    where: eventAnnouncementScalarWhereInput
    data: XOR<eventAnnouncementUpdateManyMutationInput, eventAnnouncementUncheckedUpdateManyWithoutEventInput>
  }

  export type eventAnnouncementScalarWhereInput = {
    AND?: eventAnnouncementScalarWhereInput | eventAnnouncementScalarWhereInput[]
    OR?: eventAnnouncementScalarWhereInput[]
    NOT?: eventAnnouncementScalarWhereInput | eventAnnouncementScalarWhereInput[]
    id?: StringFilter<"eventAnnouncement"> | string
    Title?: StringFilter<"eventAnnouncement"> | string
    Description?: StringFilter<"eventAnnouncement"> | string
    createdAt?: DateTimeFilter<"eventAnnouncement"> | Date | string
    updatedAt?: DateTimeNullableFilter<"eventAnnouncement"> | Date | string | null
    eventId?: StringFilter<"eventAnnouncement"> | string
  }

  export type eventGalleryUpsertWithWhereUniqueWithoutEventInput = {
    where: eventGalleryWhereUniqueInput
    update: XOR<eventGalleryUpdateWithoutEventInput, eventGalleryUncheckedUpdateWithoutEventInput>
    create: XOR<eventGalleryCreateWithoutEventInput, eventGalleryUncheckedCreateWithoutEventInput>
  }

  export type eventGalleryUpdateWithWhereUniqueWithoutEventInput = {
    where: eventGalleryWhereUniqueInput
    data: XOR<eventGalleryUpdateWithoutEventInput, eventGalleryUncheckedUpdateWithoutEventInput>
  }

  export type eventGalleryUpdateManyWithWhereWithoutEventInput = {
    where: eventGalleryScalarWhereInput
    data: XOR<eventGalleryUpdateManyMutationInput, eventGalleryUncheckedUpdateManyWithoutEventInput>
  }

  export type eventGalleryScalarWhereInput = {
    AND?: eventGalleryScalarWhereInput | eventGalleryScalarWhereInput[]
    OR?: eventGalleryScalarWhereInput[]
    NOT?: eventGalleryScalarWhereInput | eventGalleryScalarWhereInput[]
    id?: StringFilter<"eventGallery"> | string
    imageUrl?: StringFilter<"eventGallery"> | string
    caption?: StringNullableFilter<"eventGallery"> | string | null
    createdAt?: DateTimeFilter<"eventGallery"> | Date | string
    updatedAt?: DateTimeNullableFilter<"eventGallery"> | Date | string | null
    eventId?: StringFilter<"eventGallery"> | string
  }

  export type eventCreateWithoutAnnouncementsInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    club: clubsCreateNestedOneWithoutEventsInput
    speakers?: speakersCreateNestedManyWithoutEventInput
    attendees?: userEventsCreateNestedManyWithoutEventInput
    galleries?: eventGalleryCreateNestedManyWithoutEventInput
  }

  export type eventUncheckedCreateWithoutAnnouncementsInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    clubId: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    speakers?: speakersUncheckedCreateNestedManyWithoutEventInput
    attendees?: userEventsUncheckedCreateNestedManyWithoutEventInput
    galleries?: eventGalleryUncheckedCreateNestedManyWithoutEventInput
  }

  export type eventCreateOrConnectWithoutAnnouncementsInput = {
    where: eventWhereUniqueInput
    create: XOR<eventCreateWithoutAnnouncementsInput, eventUncheckedCreateWithoutAnnouncementsInput>
  }

  export type eventUpsertWithoutAnnouncementsInput = {
    update: XOR<eventUpdateWithoutAnnouncementsInput, eventUncheckedUpdateWithoutAnnouncementsInput>
    create: XOR<eventCreateWithoutAnnouncementsInput, eventUncheckedCreateWithoutAnnouncementsInput>
    where?: eventWhereInput
  }

  export type eventUpdateToOneWithWhereWithoutAnnouncementsInput = {
    where?: eventWhereInput
    data: XOR<eventUpdateWithoutAnnouncementsInput, eventUncheckedUpdateWithoutAnnouncementsInput>
  }

  export type eventUpdateWithoutAnnouncementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    club?: clubsUpdateOneRequiredWithoutEventsNestedInput
    speakers?: speakersUpdateManyWithoutEventNestedInput
    attendees?: userEventsUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUpdateManyWithoutEventNestedInput
  }

  export type eventUncheckedUpdateWithoutAnnouncementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    clubId?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    speakers?: speakersUncheckedUpdateManyWithoutEventNestedInput
    attendees?: userEventsUncheckedUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUncheckedUpdateManyWithoutEventNestedInput
  }

  export type eventCreateWithoutGalleriesInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    club: clubsCreateNestedOneWithoutEventsInput
    speakers?: speakersCreateNestedManyWithoutEventInput
    attendees?: userEventsCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementCreateNestedManyWithoutEventInput
  }

  export type eventUncheckedCreateWithoutGalleriesInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    clubId: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    speakers?: speakersUncheckedCreateNestedManyWithoutEventInput
    attendees?: userEventsUncheckedCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementUncheckedCreateNestedManyWithoutEventInput
  }

  export type eventCreateOrConnectWithoutGalleriesInput = {
    where: eventWhereUniqueInput
    create: XOR<eventCreateWithoutGalleriesInput, eventUncheckedCreateWithoutGalleriesInput>
  }

  export type eventUpsertWithoutGalleriesInput = {
    update: XOR<eventUpdateWithoutGalleriesInput, eventUncheckedUpdateWithoutGalleriesInput>
    create: XOR<eventCreateWithoutGalleriesInput, eventUncheckedCreateWithoutGalleriesInput>
    where?: eventWhereInput
  }

  export type eventUpdateToOneWithWhereWithoutGalleriesInput = {
    where?: eventWhereInput
    data: XOR<eventUpdateWithoutGalleriesInput, eventUncheckedUpdateWithoutGalleriesInput>
  }

  export type eventUpdateWithoutGalleriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    club?: clubsUpdateOneRequiredWithoutEventsNestedInput
    speakers?: speakersUpdateManyWithoutEventNestedInput
    attendees?: userEventsUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUpdateManyWithoutEventNestedInput
  }

  export type eventUncheckedUpdateWithoutGalleriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    clubId?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    speakers?: speakersUncheckedUpdateManyWithoutEventNestedInput
    attendees?: userEventsUncheckedUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUncheckedUpdateManyWithoutEventNestedInput
  }

  export type clubsCreateWithoutAnnouncementsInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    posts?: CreatePostCreateNestedManyWithoutClubInput
    members?: UserCreateNestedManyWithoutClubInput
    events?: eventCreateNestedManyWithoutClubInput
  }

  export type clubsUncheckedCreateWithoutAnnouncementsInput = {
    id?: string
    name: string
    founderEmail?: string
    coremember1?: string | null
    coremember2?: string | null
    coremember3?: string | null
    facultyEmail?: string
    collegeName: string
    collegeId?: string
    type?: string
    description: string
    requirements?: string | null
    profilePicUrl?: string | null
    clubContact?: string
    wings?: clubsCreatewingsInput | string[]
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
    posts?: CreatePostUncheckedCreateNestedManyWithoutClubInput
    members?: UserUncheckedCreateNestedManyWithoutClubInput
    events?: eventUncheckedCreateNestedManyWithoutClubInput
  }

  export type clubsCreateOrConnectWithoutAnnouncementsInput = {
    where: clubsWhereUniqueInput
    create: XOR<clubsCreateWithoutAnnouncementsInput, clubsUncheckedCreateWithoutAnnouncementsInput>
  }

  export type clubsUpsertWithoutAnnouncementsInput = {
    update: XOR<clubsUpdateWithoutAnnouncementsInput, clubsUncheckedUpdateWithoutAnnouncementsInput>
    create: XOR<clubsCreateWithoutAnnouncementsInput, clubsUncheckedCreateWithoutAnnouncementsInput>
    where?: clubsWhereInput
  }

  export type clubsUpdateToOneWithWhereWithoutAnnouncementsInput = {
    where?: clubsWhereInput
    data: XOR<clubsUpdateWithoutAnnouncementsInput, clubsUncheckedUpdateWithoutAnnouncementsInput>
  }

  export type clubsUpdateWithoutAnnouncementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    posts?: CreatePostUpdateManyWithoutClubNestedInput
    members?: UserUpdateManyWithoutClubNestedInput
    events?: eventUpdateManyWithoutClubNestedInput
  }

  export type clubsUncheckedUpdateWithoutAnnouncementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    founderEmail?: StringFieldUpdateOperationsInput | string
    coremember1?: NullableStringFieldUpdateOperationsInput | string | null
    coremember2?: NullableStringFieldUpdateOperationsInput | string | null
    coremember3?: NullableStringFieldUpdateOperationsInput | string | null
    facultyEmail?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    collegeId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicUrl?: NullableStringFieldUpdateOperationsInput | string | null
    clubContact?: StringFieldUpdateOperationsInput | string
    wings?: clubsUpdatewingsInput | string[]
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    posts?: CreatePostUncheckedUpdateManyWithoutClubNestedInput
    members?: UserUncheckedUpdateManyWithoutClubNestedInput
    events?: eventUncheckedUpdateManyWithoutClubNestedInput
  }

  export type UserCreateWithoutEventAttendedInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    club?: clubsCreateNestedOneWithoutMembersInput
    CreatePost?: CreatePostCreateNestedManyWithoutAuthorInput
    postUpvotes?: PostUpvoteCreateNestedManyWithoutUserInput
    postDownvotes?: PostDownvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEventAttendedInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    clubId?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    CreatePost?: CreatePostUncheckedCreateNestedManyWithoutAuthorInput
    postUpvotes?: PostUpvoteUncheckedCreateNestedManyWithoutUserInput
    postDownvotes?: PostDownvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEventAttendedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEventAttendedInput, UserUncheckedCreateWithoutEventAttendedInput>
  }

  export type eventCreateWithoutAttendeesInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    club: clubsCreateNestedOneWithoutEventsInput
    speakers?: speakersCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementCreateNestedManyWithoutEventInput
    galleries?: eventGalleryCreateNestedManyWithoutEventInput
  }

  export type eventUncheckedCreateWithoutAttendeesInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    clubId: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
    speakers?: speakersUncheckedCreateNestedManyWithoutEventInput
    announcements?: eventAnnouncementUncheckedCreateNestedManyWithoutEventInput
    galleries?: eventGalleryUncheckedCreateNestedManyWithoutEventInput
  }

  export type eventCreateOrConnectWithoutAttendeesInput = {
    where: eventWhereUniqueInput
    create: XOR<eventCreateWithoutAttendeesInput, eventUncheckedCreateWithoutAttendeesInput>
  }

  export type UserUpsertWithoutEventAttendedInput = {
    update: XOR<UserUpdateWithoutEventAttendedInput, UserUncheckedUpdateWithoutEventAttendedInput>
    create: XOR<UserCreateWithoutEventAttendedInput, UserUncheckedCreateWithoutEventAttendedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEventAttendedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEventAttendedInput, UserUncheckedUpdateWithoutEventAttendedInput>
  }

  export type UserUpdateWithoutEventAttendedInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    club?: clubsUpdateOneWithoutMembersNestedInput
    CreatePost?: CreatePostUpdateManyWithoutAuthorNestedInput
    postUpvotes?: PostUpvoteUpdateManyWithoutUserNestedInput
    postDownvotes?: PostDownvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEventAttendedInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    CreatePost?: CreatePostUncheckedUpdateManyWithoutAuthorNestedInput
    postUpvotes?: PostUpvoteUncheckedUpdateManyWithoutUserNestedInput
    postDownvotes?: PostDownvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type eventUpsertWithoutAttendeesInput = {
    update: XOR<eventUpdateWithoutAttendeesInput, eventUncheckedUpdateWithoutAttendeesInput>
    create: XOR<eventCreateWithoutAttendeesInput, eventUncheckedCreateWithoutAttendeesInput>
    where?: eventWhereInput
  }

  export type eventUpdateToOneWithWhereWithoutAttendeesInput = {
    where?: eventWhereInput
    data: XOR<eventUpdateWithoutAttendeesInput, eventUncheckedUpdateWithoutAttendeesInput>
  }

  export type eventUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    club?: clubsUpdateOneRequiredWithoutEventsNestedInput
    speakers?: speakersUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUpdateManyWithoutEventNestedInput
  }

  export type eventUncheckedUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    clubId?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    speakers?: speakersUncheckedUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUncheckedUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUncheckedUpdateManyWithoutEventNestedInput
  }

  export type CreatePostCreateWithoutUpvotesInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    club?: clubsCreateNestedOneWithoutPostsInput
    author: UserCreateNestedOneWithoutCreatePostInput
    downvotes?: PostDownvoteCreateNestedManyWithoutPostInput
  }

  export type CreatePostUncheckedCreateWithoutUpvotesInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    collegeId?: string | null
    authorId: string
    downvotes?: PostDownvoteUncheckedCreateNestedManyWithoutPostInput
  }

  export type CreatePostCreateOrConnectWithoutUpvotesInput = {
    where: CreatePostWhereUniqueInput
    create: XOR<CreatePostCreateWithoutUpvotesInput, CreatePostUncheckedCreateWithoutUpvotesInput>
  }

  export type UserCreateWithoutPostUpvotesInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsCreateNestedManyWithoutUserInput
    club?: clubsCreateNestedOneWithoutMembersInput
    CreatePost?: CreatePostCreateNestedManyWithoutAuthorInput
    postDownvotes?: PostDownvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPostUpvotesInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    clubId?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsUncheckedCreateNestedManyWithoutUserInput
    CreatePost?: CreatePostUncheckedCreateNestedManyWithoutAuthorInput
    postDownvotes?: PostDownvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPostUpvotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPostUpvotesInput, UserUncheckedCreateWithoutPostUpvotesInput>
  }

  export type CreatePostUpsertWithoutUpvotesInput = {
    update: XOR<CreatePostUpdateWithoutUpvotesInput, CreatePostUncheckedUpdateWithoutUpvotesInput>
    create: XOR<CreatePostCreateWithoutUpvotesInput, CreatePostUncheckedCreateWithoutUpvotesInput>
    where?: CreatePostWhereInput
  }

  export type CreatePostUpdateToOneWithWhereWithoutUpvotesInput = {
    where?: CreatePostWhereInput
    data: XOR<CreatePostUpdateWithoutUpvotesInput, CreatePostUncheckedUpdateWithoutUpvotesInput>
  }

  export type CreatePostUpdateWithoutUpvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    club?: clubsUpdateOneWithoutPostsNestedInput
    author?: UserUpdateOneRequiredWithoutCreatePostNestedInput
    downvotes?: PostDownvoteUpdateManyWithoutPostNestedInput
  }

  export type CreatePostUncheckedUpdateWithoutUpvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    collegeId?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    downvotes?: PostDownvoteUncheckedUpdateManyWithoutPostNestedInput
  }

  export type UserUpsertWithoutPostUpvotesInput = {
    update: XOR<UserUpdateWithoutPostUpvotesInput, UserUncheckedUpdateWithoutPostUpvotesInput>
    create: XOR<UserCreateWithoutPostUpvotesInput, UserUncheckedCreateWithoutPostUpvotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPostUpvotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPostUpvotesInput, UserUncheckedUpdateWithoutPostUpvotesInput>
  }

  export type UserUpdateWithoutPostUpvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUpdateManyWithoutUserNestedInput
    club?: clubsUpdateOneWithoutMembersNestedInput
    CreatePost?: CreatePostUpdateManyWithoutAuthorNestedInput
    postDownvotes?: PostDownvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPostUpvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUncheckedUpdateManyWithoutUserNestedInput
    CreatePost?: CreatePostUncheckedUpdateManyWithoutAuthorNestedInput
    postDownvotes?: PostDownvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CreatePostCreateWithoutDownvotesInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    club?: clubsCreateNestedOneWithoutPostsInput
    author: UserCreateNestedOneWithoutCreatePostInput
    upvotes?: PostUpvoteCreateNestedManyWithoutPostInput
  }

  export type CreatePostUncheckedCreateWithoutDownvotesInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    collegeId?: string | null
    authorId: string
    upvotes?: PostUpvoteUncheckedCreateNestedManyWithoutPostInput
  }

  export type CreatePostCreateOrConnectWithoutDownvotesInput = {
    where: CreatePostWhereUniqueInput
    create: XOR<CreatePostCreateWithoutDownvotesInput, CreatePostUncheckedCreateWithoutDownvotesInput>
  }

  export type UserCreateWithoutPostDownvotesInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsCreateNestedManyWithoutUserInput
    club?: clubsCreateNestedOneWithoutMembersInput
    CreatePost?: CreatePostCreateNestedManyWithoutAuthorInput
    postUpvotes?: PostUpvoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPostDownvotesInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    clubId?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
    eventAttended?: userEventsUncheckedCreateNestedManyWithoutUserInput
    CreatePost?: CreatePostUncheckedCreateNestedManyWithoutAuthorInput
    postUpvotes?: PostUpvoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPostDownvotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPostDownvotesInput, UserUncheckedCreateWithoutPostDownvotesInput>
  }

  export type CreatePostUpsertWithoutDownvotesInput = {
    update: XOR<CreatePostUpdateWithoutDownvotesInput, CreatePostUncheckedUpdateWithoutDownvotesInput>
    create: XOR<CreatePostCreateWithoutDownvotesInput, CreatePostUncheckedCreateWithoutDownvotesInput>
    where?: CreatePostWhereInput
  }

  export type CreatePostUpdateToOneWithWhereWithoutDownvotesInput = {
    where?: CreatePostWhereInput
    data: XOR<CreatePostUpdateWithoutDownvotesInput, CreatePostUncheckedUpdateWithoutDownvotesInput>
  }

  export type CreatePostUpdateWithoutDownvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    club?: clubsUpdateOneWithoutPostsNestedInput
    author?: UserUpdateOneRequiredWithoutCreatePostNestedInput
    upvotes?: PostUpvoteUpdateManyWithoutPostNestedInput
  }

  export type CreatePostUncheckedUpdateWithoutDownvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    collegeId?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    upvotes?: PostUpvoteUncheckedUpdateManyWithoutPostNestedInput
  }

  export type UserUpsertWithoutPostDownvotesInput = {
    update: XOR<UserUpdateWithoutPostDownvotesInput, UserUncheckedUpdateWithoutPostDownvotesInput>
    create: XOR<UserCreateWithoutPostDownvotesInput, UserUncheckedCreateWithoutPostDownvotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPostDownvotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPostDownvotesInput, UserUncheckedUpdateWithoutPostDownvotesInput>
  }

  export type UserUpdateWithoutPostDownvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUpdateManyWithoutUserNestedInput
    club?: clubsUpdateOneWithoutMembersNestedInput
    CreatePost?: CreatePostUpdateManyWithoutAuthorNestedInput
    postUpvotes?: PostUpvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPostDownvotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUncheckedUpdateManyWithoutUserNestedInput
    CreatePost?: CreatePostUncheckedUpdateManyWithoutAuthorNestedInput
    postUpvotes?: PostUpvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userEventsCreateManyUserInput = {
    eventId: string
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
  }

  export type CreatePostCreateManyAuthorInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    collegeId?: string | null
  }

  export type PostUpvoteCreateManyUserInput = {
    id?: string
    postId: string
    createdAt?: Date | string
  }

  export type PostDownvoteCreateManyUserInput = {
    id?: string
    postId: string
    createdAt?: Date | string
  }

  export type userEventsUpdateWithoutUserInput = {
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    event?: eventUpdateOneRequiredWithoutAttendeesNestedInput
  }

  export type userEventsUncheckedUpdateWithoutUserInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type userEventsUncheckedUpdateManyWithoutUserInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CreatePostUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    club?: clubsUpdateOneWithoutPostsNestedInput
    upvotes?: PostUpvoteUpdateManyWithoutPostNestedInput
    downvotes?: PostDownvoteUpdateManyWithoutPostNestedInput
  }

  export type CreatePostUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    collegeId?: NullableStringFieldUpdateOperationsInput | string | null
    upvotes?: PostUpvoteUncheckedUpdateManyWithoutPostNestedInput
    downvotes?: PostDownvoteUncheckedUpdateManyWithoutPostNestedInput
  }

  export type CreatePostUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    collegeId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PostUpvoteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CreatePostUpdateOneRequiredWithoutUpvotesNestedInput
  }

  export type PostUpvoteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpvoteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostDownvoteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CreatePostUpdateOneRequiredWithoutDownvotesNestedInput
  }

  export type PostDownvoteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostDownvoteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CreatePostCreateManyClubInput = {
    id?: string
    title: string
    description: string
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    published?: boolean
    collegeName?: string
    clubName?: string
    authorId: string
  }

  export type UserCreateManyClubInput = {
    id?: string
    clerkId?: string | null
    email: string
    collegeName?: string
    name?: string | null
    profileAvatar?: string | null
    password: string
    createdAt?: Date | string
    vToken?: string | null
    expiryToken?: number | null
    ValidFor?: number | null
    isVerified?: boolean | null
    clubName?: string | null
    bio?: string | null
    tags?: UserCreatetagsInput | string[]
    course?: string | null
    year?: string | null
    phone?: string | null
    twitter?: string | null
    linkedin?: string | null
    instagram?: string | null
  }

  export type eventCreateManyClubInput = {
    id?: string
    posterUrl?: string | null
    EventMode?: string
    EventType?: string
    eventHeaderImage?: string | null
    EventName: string
    description: string
    tagline?: string | null
    prizes?: string
    TeamSize?: number
    Venue?: string
    EventUrl?: string | null
    applicationStatus?: string
    applicationStartDate?: string | null
    applicationEndDate?: string | null
    clubName: string
    university: string
    createdAt?: Date | string
    startDate: string
    endDate?: string | null
    collegeStudentsOnly?: boolean
    participationFee?: boolean
    contactEmail: string
    contactPhone?: string | null
    Form?: string | null
    Fees?: string | null
    link1?: string | null
    link2?: string | null
    link3?: string | null
    whatsappLink?: string | null
    isPaid?: boolean
    qrCodeUrl?: string | null
  }

  export type clubAnnouncementCreateManyClubInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type CreatePostUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    author?: UserUpdateOneRequiredWithoutCreatePostNestedInput
    upvotes?: PostUpvoteUpdateManyWithoutPostNestedInput
    downvotes?: PostDownvoteUpdateManyWithoutPostNestedInput
  }

  export type CreatePostUncheckedUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    upvotes?: PostUpvoteUncheckedUpdateManyWithoutPostNestedInput
    downvotes?: PostDownvoteUncheckedUpdateManyWithoutPostNestedInput
  }

  export type CreatePostUncheckedUpdateManyWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    published?: BoolFieldUpdateOperationsInput | boolean
    collegeName?: StringFieldUpdateOperationsInput | string
    clubName?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUpdateManyWithoutUserNestedInput
    CreatePost?: CreatePostUpdateManyWithoutAuthorNestedInput
    postUpvotes?: PostUpvoteUpdateManyWithoutUserNestedInput
    postDownvotes?: PostDownvoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
    eventAttended?: userEventsUncheckedUpdateManyWithoutUserNestedInput
    CreatePost?: CreatePostUncheckedUpdateManyWithoutAuthorNestedInput
    postUpvotes?: PostUpvoteUncheckedUpdateManyWithoutUserNestedInput
    postDownvotes?: PostDownvoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    collegeName?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryToken?: NullableIntFieldUpdateOperationsInput | number | null
    ValidFor?: NullableIntFieldUpdateOperationsInput | number | null
    isVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    clubName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UserUpdatetagsInput | string[]
    course?: NullableStringFieldUpdateOperationsInput | string | null
    year?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    twitter?: NullableStringFieldUpdateOperationsInput | string | null
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    instagram?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type eventUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    speakers?: speakersUpdateManyWithoutEventNestedInput
    attendees?: userEventsUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUpdateManyWithoutEventNestedInput
  }

  export type eventUncheckedUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    speakers?: speakersUncheckedUpdateManyWithoutEventNestedInput
    attendees?: userEventsUncheckedUpdateManyWithoutEventNestedInput
    announcements?: eventAnnouncementUncheckedUpdateManyWithoutEventNestedInput
    galleries?: eventGalleryUncheckedUpdateManyWithoutEventNestedInput
  }

  export type eventUncheckedUpdateManyWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    posterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    EventMode?: StringFieldUpdateOperationsInput | string
    EventType?: StringFieldUpdateOperationsInput | string
    eventHeaderImage?: NullableStringFieldUpdateOperationsInput | string | null
    EventName?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    prizes?: StringFieldUpdateOperationsInput | string
    TeamSize?: IntFieldUpdateOperationsInput | number
    Venue?: StringFieldUpdateOperationsInput | string
    EventUrl?: NullableStringFieldUpdateOperationsInput | string | null
    applicationStatus?: StringFieldUpdateOperationsInput | string
    applicationStartDate?: NullableStringFieldUpdateOperationsInput | string | null
    applicationEndDate?: NullableStringFieldUpdateOperationsInput | string | null
    clubName?: StringFieldUpdateOperationsInput | string
    university?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    collegeStudentsOnly?: BoolFieldUpdateOperationsInput | boolean
    participationFee?: BoolFieldUpdateOperationsInput | boolean
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    Form?: NullableStringFieldUpdateOperationsInput | string | null
    Fees?: NullableStringFieldUpdateOperationsInput | string | null
    link1?: NullableStringFieldUpdateOperationsInput | string | null
    link2?: NullableStringFieldUpdateOperationsInput | string | null
    link3?: NullableStringFieldUpdateOperationsInput | string | null
    whatsappLink?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type clubAnnouncementUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type clubAnnouncementUncheckedUpdateWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type clubAnnouncementUncheckedUpdateManyWithoutClubInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PostUpvoteCreateManyPostInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type PostDownvoteCreateManyPostInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type PostUpvoteUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPostUpvotesNestedInput
  }

  export type PostUpvoteUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpvoteUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostDownvoteUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPostDownvotesNestedInput
  }

  export type PostDownvoteUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostDownvoteUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type speakersCreateManyEventInput = {
    id?: number
    profilePic?: string | null
    about: string
    name: string
    email: string
  }

  export type userEventsCreateManyEventInput = {
    userId: string
    uniquePassId?: string | null
    joinedAt?: Date | string
    paymentScreenshotUrl?: string | null
    paymentStatus?: string
    paymentVerifiedAt?: Date | string | null
  }

  export type eventAnnouncementCreateManyEventInput = {
    id?: string
    Title: string
    Description: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type eventGalleryCreateManyEventInput = {
    id?: string
    imageUrl: string
    caption?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type speakersUpdateWithoutEventInput = {
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    about?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type speakersUncheckedUpdateWithoutEventInput = {
    id?: IntFieldUpdateOperationsInput | number
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    about?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type speakersUncheckedUpdateManyWithoutEventInput = {
    id?: IntFieldUpdateOperationsInput | number
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
    about?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type userEventsUpdateWithoutEventInput = {
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutEventAttendedNestedInput
  }

  export type userEventsUncheckedUpdateWithoutEventInput = {
    userId?: StringFieldUpdateOperationsInput | string
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type userEventsUncheckedUpdateManyWithoutEventInput = {
    userId?: StringFieldUpdateOperationsInput | string
    uniquePassId?: NullableStringFieldUpdateOperationsInput | string | null
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentScreenshotUrl?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventAnnouncementUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventAnnouncementUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventAnnouncementUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    Title?: StringFieldUpdateOperationsInput | string
    Description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventGalleryUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventGalleryUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventGalleryUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}