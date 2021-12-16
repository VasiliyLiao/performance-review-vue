import gql from 'graphql-tag'

export const LOGIN = gql `mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
}`;

export const CREATE_EMPLOYEE = gql `mutation Mutation($input: EmployeeInput!) {
    createEmployee(input: $input) {
      id
      name
      email
      role
    }
}`;

export const UPDATE_EMPLOYEE = gql `mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      name
      email
      role
    }
}`;
 
export const DELETE_EMPLOYEE = gql `mutation Mutation($id: ID!) {
    deleteEmployee(id: $id)
}`;

export const CREATE_PERFORMANCE_REVIEWS = gql `mutation Mutation($input: PerformanceReviewInput!) {
  createPerformanceReviews(input: $input)
}`;

export const UPDATE_PERFORMANCE_REVIEWS = gql `mutation UpdatePerformanceReviews($id: ID!, $input: PerformanceReviewInput!) {
  updatePerformanceReviews(id: $id, input: $input)
}`;

export const DELETE_PERFORMANCE_REVIEWS = gql `mutation DeletePerformancereview($id: ID!) {
  deletePerformancereview(id: $id)
}`;

export const SUBMIT_FEEDBACK_COMMENT = gql`mutation Mutation($id: ID!, $comment: String) {
  submitFeedback(id: $id, comment: $comment)
}`