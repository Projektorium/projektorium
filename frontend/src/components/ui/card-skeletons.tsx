import { Box, Flex, HStack, Skeleton, Stack } from "@chakra-ui/react";

export const ProjectCardSkeleton = () => {
  return (
    <Box p={4} width="100%">
      {/* Header with status badge */}
      <Flex justifyContent="space-between" mb={4}>
        <Skeleton height="32px" width="100px" borderRadius="8px"/>
        <HStack gap={2}>
          <Skeleton height="48px" width="48px" borderRadius="full" />
          <Skeleton height="48px" width="125px" borderRadius="24px" />
        </HStack>
      </Flex>

      {/* Title */}
      <Skeleton height="28px" width="70%" mb={3} />

      {/* Description - multiple lines */}
      <Stack gap={2} mb={6}>
        <Skeleton height="16px" width="80%" />
        <Skeleton height="16px" width="90%" />
        <Skeleton height="16px" width="70%" />
      </Stack>

      {/* Tags */}
      <HStack gap={2}>
        <Skeleton height="40px" width="100px" borderRadius="full" />
        <Skeleton height="40px" width="100px" borderRadius="full" />
        <Skeleton height="40px" width="200px" borderRadius="full" />
      </HStack>
    </Box>
  );
};

export const PersonCardSkeleton = () => {
  return (
    <Flex p={4} width="100%">
      {/* Avatar */}
      <Skeleton
        height="64px"
        width="64px"
        borderRadius="full"
        mr={4}
        flexShrink={0}
      />

      <Box flex="1">
        {/* Name */}
        <Skeleton height="28px" width="50%" mb={3} />

        {/* Description - multiple lines */}
        <Stack gap={2} mb={6}>
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="90%" />
          <Skeleton height="16px" width="95%" />
        </Stack>

        {/* Tags */}
        <HStack gap={2}>
          <Skeleton height="40px" width="100px" borderRadius="full" />
          <Skeleton height="40px" width="100px" borderRadius="full" />
          <Skeleton height="40px" width="200px" borderRadius="full" />
        </HStack>
      </Box>

      {/* Action buttons */}
      <Flex alignItems="flex-start" ml={4}>
        <HStack gap={2}>
          <Skeleton height="48px" width="48px" borderRadius="full" />
          <Skeleton height="48px" width="125px" borderRadius="24px" />
        </HStack>
      </Flex>
    </Flex>
  );
};

export const SkeletonList = ({ type, count = 3 }: { type: 'project' | 'person', count?: number }) => {
  const SkeletonComponent = type === 'project' ? ProjectCardSkeleton : PersonCardSkeleton;

  return (
    <Stack gap={4} width="100%">
      {Array(count).fill(0).map((_, index) => (
        <Box key={index} width="100%">
          <SkeletonComponent />
          {index < count - 1 && <Box height="1px" bg="gray.200" mt={4} />}
        </Box>
      ))}
    </Stack>
  );
};