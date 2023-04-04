import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, IconButton } from '@chakra-ui/react'
import React from 'react'
import { PostSnippetFragment, useVoteMutation} from '../gql/graphql'

interface UpdootSectionProps {
    post:PostSnippetFragment
}

export const UpdootSection:React.FC<UpdootSectionProps> = ({post}) => {
    const [,vote] = useVoteMutation()
  return (
    <Flex direction={"column"} justifyContent="center" alignItems={"center"} mr={4}>
        <IconButton onClick={async ()=>{
            if (post.voteStatus === 1){
              return
            }
            vote({
                postId:post.id,
                value:1
            })
        }} 
        colorScheme={post.voteStatus === 1 ? 'green': undefined}
        aria-label='Updoot post' icon={<ChevronUpIcon/>} />
          
          {post.points}
          
          <IconButton onClick={()=>{
            if (post.voteStatus === -1){
              return
            }
            vote({
                postId:post.id,
                value:-1
            })
          }} 
          colorScheme={post.voteStatus === -1 ? 'red': undefined}
          aria-label='Downdoot Post' icon={<ChevronDownIcon/>} />
        </Flex>
  )
}
