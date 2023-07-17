/** @jsxImportSource @emotion/react */
import React from "react";
import { useState } from "react";
import { css } from "@emotion/react";
import Link from "next/link";

const styles = {
  navbar: css`
    position: relative;
    z-index: 30;
  `,
  navbarBurger: css`
    color: #4a4a4a;
    cursor: pointer;
    display: block;
    height: 3.25rem;
    width: 3.25rem;
    &:hover {
      background-color: #e1e1e1;
    }

    display: none;
    @media (max-width: 1023px) {
      display: block;
    }
  `,
  humbergerSpan(isActive: boolean) {
    return css`
      background-color: currentColor;
      display: block;
      height: 1px;
      left: calc(50% - 8px);
      position: absolute;
      transform-origin: center;
      transition-duration: 86ms;
      transition-property: background-color, opacity, transform;
      transition-timing-function: ease-out;
      width: 16px;

      &:nth-of-type(1) {
        top: calc(50% - 6px);
        ${isActive === true && `transform: translateY(5px) rotate(45deg);`}
      }
      &:nth-of-type(2) {
        top: calc(50% - 1px);
        ${isActive === true && `opacity: 0;`}
      }
      &:nth-of-type(3) {
        top: calc(50% + 4px);
        ${isActive === true && `transform: translateY(-5px) rotate(-45deg);`}
      }
    `;
  },
  navbarMenu(isActive: boolean) {
    return css`
      @media (max-width: 1023px) {
        right: 0px;
        position: absolute;
        background-color: #fff;
        box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
        padding: 0.5rem 0;
        ${isActive === false && `display:none;`}
      }
    `;
  },
  navbarItem: css`
    cursor: pointer;
    color: #4a4a4a;
    line-height: 1.5;
    padding: 0.5rem 0.75rem;
    position: relative;
    &:hover {
      background-color: #e1e1e1;
    }

    display: inline-block;
    @media (max-width: 1023px) {
      display: block;
    }
  `,
};

const menuList = [
  {
    label: "Bio",
    path: "bio",
  },
  {
    label: "Project",
    path: "project",
  },
];

export default function HeaderNav() {
  const [navBarIsActive, setNavBarIsActive] = useState(false);

  const toggleNavBar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setNavBarIsActive((prevState) => !prevState);
  };

  return (
    <div css={styles.navbar}>
      <span css={styles.navbarBurger} onClick={toggleNavBar}>
        <span css={styles.humbergerSpan(navBarIsActive)} />
        <span css={styles.humbergerSpan(navBarIsActive)} />
        <span css={styles.humbergerSpan(navBarIsActive)} />
      </span>
      <div css={styles.navbarMenu(navBarIsActive)}>
        <div>
          {menuList.map((menu) => (
            <Link
              href={`/${menu.path}`}
              css={styles.navbarItem}
              key={menu.label}
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
