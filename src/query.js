import gql from 'graphql-tag'

export const GET_ALL_EMPLOYEES = gql`query Query {
    allEmployees {
        id
        name
        email
        role
    }
}`;

export const GET_ALL_REVIEWS = gql`query Query {
    allPerformanceReviews {
        id
        owner {
            id
            name
        }
        feedbacks {
            id
            writer {
                id
                name
            }
            comment
        }
    }
}`;

export const MY_NEED_WRITE_REVIEWS = gql `query Query {
    myNeedWriteReviews {
      id
      owner {
        name
        id
      }
      feedbacks {
        id
        writer {
          name
          id
        }
        comment
      }
    }
  }`