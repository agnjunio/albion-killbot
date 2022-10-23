import styled from "styled-components";

const StyledHeader = styled.div`
  color: ${({ theme }) => theme.text};

  nav {
    padding: 0rem 4rem;

    &.navbar-expand-lg {
      justify-content: space-between;
    }

    .navbar-brand {
      .nav-link {
        padding: 0;

        .logo {
          width: auto;
          height: 5rem;
          max-width: 100%;
        }
      }
    }

    .navbar-toggler {
      color: ${({ theme }) => theme.primary};

      &:focus {
        box-shadow: 0 0 0 0.07rem;
      }
    }

    .navbar-nav {
      flex-basis: 100%;
      display: flex;
      align-items: center;
      justify-content: end;

      .nav-link:not(.btn),
      svg.loader {
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
        color: ${({ theme }) => theme.text};

        &:hover {
          color: ${({ theme }) => theme.primary};
        }

        img,
        svg {
          padding: 0 0.5rem;

          &.user-avatar {
            border-radius: 50%;
            margin-left: 0.75rem;
            padding: 0;
            height: 50px;
            width: 50px;
            box-shadow: 0px 0px 10px ${({ theme }) => theme.text}60;
          }
        }
      }

      a.btn {
        margin-left: 1.5rem;
        padding: 0.5rem 1.5rem;
      }

      .dropdown {
        .dropdown-menu {
          margin-top: 0.5rem;
          margin-right: 1.5rem;
        }

        .dropdown-toggle::after {
          display: none;
        }
      }
    }

    @media (max-width: 992px) {
      padding: 0 1rem 0rem;

      &.navbar-expand-lg {
        justify-content: space-between;
      }

      .navbar-brand {
        flex-basis: 60%;
        margin: 0;
      }

      .navbar-nav {
        flex-direction: column;
        padding-bottom: 0.75rem;
        align-items: end;

        svg.loader {
          padding: 0 0.5rem;
        }

        .nav-link:not(.btn) {
          padding: 0.75rem 0.5rem;
          display: flex;
          justify-content: end;
          width: 100%;
        }
      }
    }
  }
`;

export default StyledHeader;
