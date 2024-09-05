import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['Int']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  numberIncremented?: Maybe<Scalars['Int']['output']>;
};

export type NumberIncrementedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NumberIncrementedSubscription = { __typename?: 'Subscription', numberIncremented?: number | null };


export const NumberIncrementedDocument = gql`
    subscription NumberIncremented {
  numberIncremented
}
    `;

/**
 * __useNumberIncrementedSubscription__
 *
 * To run a query within a React component, call `useNumberIncrementedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNumberIncrementedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNumberIncrementedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNumberIncrementedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NumberIncrementedSubscription, NumberIncrementedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NumberIncrementedSubscription, NumberIncrementedSubscriptionVariables>(NumberIncrementedDocument, options);
      }
export type NumberIncrementedSubscriptionHookResult = ReturnType<typeof useNumberIncrementedSubscription>;
export type NumberIncrementedSubscriptionResult = Apollo.SubscriptionResult<NumberIncrementedSubscription>;