import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Heading, Text, Flex, IconButton, Box } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../gql/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [, deletePost] = useDeletePostMutation();

  const [{ data: meData }] = useMeQuery();

  if (meData?.me?.id !== creatorId) {
    return null;
  }
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton mr={4} aria-label="Edit post" icon={<EditIcon />} />
      </NextLink>
      <IconButton
        onClick={() => {
          deletePost({ id });
        }}
        aria-label="Delete post"
        icon={<DeleteIcon />}
      />
    </Box>
  );
};
