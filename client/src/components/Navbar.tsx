import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../gql/graphql";
import { useRouter } from "next/router";

interface NavBarProps {}

const Navbar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [isServer, setIsServer] = useState(true);

  useEffect(() => setIsServer(false), []);

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer,
  });
  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    // user is logged in
    body = (
      <Flex>
        <NextLink href="/login">
          <Box mr={2}>Login</Box>
        </NextLink>
        <NextLink href="/register">
          <Box>Register</Box>
        </NextLink>
      </Flex>
    );
  } else {
    body = (
      <Flex justify={"center"} align={"center"}>
        <NextLink href="/create-post">
          <Button color="teal" mr={4}>
            Create Post
          </Button>
        </NextLink>
        <Box mr={2}>{data?.me?.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="tan"
      p={4}
      alignItems={"center"}
    >
      <Flex flex={1} align="center" maxW={800} m={"auto"}>
        <NextLink href="/">
          <Heading>LiReddit</Heading>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
