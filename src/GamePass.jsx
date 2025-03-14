import React, { useState } from "react";
import {
    Box,
    Button,
    Select,
    Text,
    Progress,
    VStack,
    HStack,
    Stack,
    Card,
    Portal,
    createListCollection,
    Show,
    Presence,
    useDisclosure,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { toaster } from "@/components/ui/toaster";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Глобальні рівні – винагороди єдині для всіх предметів
const globalLevels = [
    { level: 1, xp: 0, reward: "Початковий рівень", icon: "🌱" },
    { level: 2, xp: 200, reward: "Маленька винагорода", icon: "☕" },
    { level: 3, xp: 500, reward: "День без навчання", icon: "🏖️" },
    { level: 4, xp: 1000, reward: "Грошова винагорода (50 грн)", icon: "💰" },
    { level: 5, xp: 2000, reward: "Грошова винагорода (100 грн)", icon: "💵" },
    { level: 6, xp: 3000, reward: "Приз (книга чи щось інше)", icon: "🏆" },
];

// Налаштування предметів із окремими діями (досягнення)
const subjects = createListCollection({
    items: [
        {
            value: "math",
            label: "Математика",
            actions: [
                {
                    name: "Завершити лабораторну (математика)",
                    xp: 50,
                    maxCount: 5,
                },
                {
                    name: "Відвідування лекції (математика)",
                    xp: 10,
                    maxCount: 10,
                },
            ],
        },
        {
            value: "physics",
            label: "Фізика",
            actions: [
                { name: "Завершити лабораторну (фізика)", xp: 60, maxCount: 4 },
                { name: "Відвідування лекції (фізика)", xp: 15, maxCount: 8 },
            ],
        },
    ],
});

export default function GamePass() {
    const [xp, setXp] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState(
        subjects.items[0].value
    );
    const [subjectActionCounts, setSubjectActionCounts] = useState({});
    const [showOverview, setShowOverview] = useState(false);
    const { open, onToggle } = useDisclosure();
    console.log(open);
    const currentSubject = subjects.items.find(
        (s) => s.value === selectedSubject
    );
    console.log(selectedSubject, currentSubject);
    const currentActionCounts = subjectActionCounts[selectedSubject] || {};

    const currentGlobalLevel =
        globalLevels.findLast((level) => xp >= level.xp) || globalLevels[0];
    const nextGlobalLevel = globalLevels.find((level) => level.xp > xp);

    const handleXpGain = (action) => {
        const currentCount = currentActionCounts[action.name] || 0;
        if (currentCount >= action.maxCount) return;

        const updatedCounts = {
            ...currentActionCounts,
            [action.name]: currentCount + 1,
        };
        setSubjectActionCounts({
            ...subjectActionCounts,
            [selectedSubject]: updatedCounts,
        });
        const newXp = xp + action.xp;
        setXp(newXp);

        const newLevel = globalLevels.findLast((level) => newXp >= level.xp);
        if (newLevel && newLevel.level !== currentGlobalLevel.level) {
            toaster.create({
                title: `Вітаємо! Ви досягли глобального рівня ${newLevel.level}: ${newLevel.reward}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const sliderSettings = {
        dots: true,
        speed: 300,
        slidesToShow: 2,
        infinite: false,
        slidesToScroll: 1,
        swipeToSlide: true,
        swipe: true,
        arrows: false,
    };

    return (
        <Box
            my={5}
            p={6}
            maxW="3xl"
            mx="auto"
            textAlign="center"
            bgGradient="linear(to-b, gray.800, gray.900, black)"
            color="white"
            borderRadius="xl"
            boxShadow="lg"
            borderWidth="1px"
            borderColor="gray.700"
            fontFamily="sans-serif">
            <Text fontSize="4xl" fontWeight="bold" color="indigo.300" mb={6}>
                Навчальний Гейм-Пас
            </Text>
            <HStack mb={4} justify="center" spacing={4}>
                <Text>Обрати предмет:</Text>
                {/* <Select.Root

                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    size="md"></Select.Root> */}

                <Select.Root
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    collection={subjects}
                    value={[selectedSubject]}
                    onValueChange={(e) => setSelectedSubject(e.value[0])}>
                    <Select.HiddenSelect />
                    {/* <Select.Label>Select framework</Select.Label> */}
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Оберіть предмет" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {subjects.items.map((subject) => (
                                    <Select.Item
                                        item={subject}
                                        key={subject.value}>
                                        {subject.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Button onClick={onToggle}>
                    {open
                        ? "Приховати прогрес"
                        : "Переглянути прогрес винагород"}
                </Button>
            </HStack>
            <Box
                bg="gray.700"
                borderColor="gray.600"
                p={6}
                borderRadius="xl"
                boxShadow="md">
                <Text fontSize="2xl" fontWeight="semibold">
                    Ваш глобальний XP:{" "}
                    <Text as="span" color="blue.300">
                        {xp}
                    </Text>
                </Text>
                <Text fontSize="xl">
                    Глобальний рівень:{" "}
                    <Text as="span" color="green.300">
                        {currentGlobalLevel.level}
                    </Text>
                </Text>
                <Text fontSize="xl">
                    Винагорода:{" "}
                    <Text as="span" color="yellow.300">
                        {currentGlobalLevel.reward}
                    </Text>
                </Text>
                {nextGlobalLevel && (
                    <>
                        <Text fontSize="sm" color="gray.300" mt={2}>
                            До наступного рівня:{" "}
                            <Text as="span" color="red.300">
                                {nextGlobalLevel.xp - xp} XP
                            </Text>
                        </Text>
                        <Progress.Root
                            colorPalette="green"
                            size="lg"
                            mt={2}
                            value={
                                ((xp - currentGlobalLevel.xp) /
                                    (nextGlobalLevel.xp -
                                        currentGlobalLevel.xp)) *
                                100
                            }>
                            <Progress.Track>
                                <Progress.Range />
                            </Progress.Track>
                        </Progress.Root>
                    </>
                )}
            </Box>
            <VStack spacing={4} mt={6}>
                {currentSubject.actions.map((action) => {
                    const count = currentActionCounts[action.name] || 0;
                    const disabled = count >= action.maxCount;
                    return (
                        <Button
                            key={action.name}
                            onClick={() => handleXpGain(action)}
                            p={4}
                            borderRadius={8}
                            bg="blue.600"
                            color="white"
                            fontSize="md"
                            fontWeight="semibold"
                            textTransform="uppercase"
                            _hover={{ bg: "blue.500" }}
                            transition={"all 0.2s"}
                            _active={{ scale: 0.95 }}
                            disabled={disabled}>
                            {action.name} (+{action.xp} XP)
                            <Text fontSize="sm" mt={1} color="gray.400">
                                Виконано: {count} / {action.maxCount}
                            </Text>
                        </Button>
                    );
                })}
            </VStack>
            <Presence
                m={10}
                present={open}
                animationName={{ _open: "fade-in", _closed: "fade-out" }}
                animationDuration="moderate">
                <Slider {...sliderSettings}>
                    {globalLevels.map((reward) => {
                        const achieved = xp >= reward.xp;
                        return (
                            <div key={reward.level} className="p-2">
                                <Box
                                    p={4}
                                    minW="150px"
                                    // borderRadius="xl"
                                    // boxShadow="lg"
                                    border="black solid 1px"
                                    pos="relative"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    bg={achieved ? "green.600" : "gray.600"}
                                    borderColor={
                                        achieved ? "green.800" : "gray.800"
                                    }>
                                    <Text fontSize="5xl" mb={2}>
                                        {reward.icon}
                                    </Text>
                                    <Text fontSize="lg" fontWeight="bold">
                                        Рівень {reward.level}
                                    </Text>
                                    <Text fontSize="sm" mt={1}>
                                        {reward.reward}
                                    </Text>
                                    <Text fontSize="xs" mt={1}>
                                        Потрібно: {reward.xp} XP
                                    </Text>
                                    {achieved && (
                                        <Text
                                            top="10px"
                                            left="10px"
                                            pos="absolute"
                                            lineHeight="60px"
                                            fontSize={72}
                                            color="green.200"
                                            fontWeight="semibold">
                                            ✓
                                        </Text>
                                    )}
                                </Box>
                            </div>
                        );
                    })}
                </Slider>
            </Presence>
        </Box>
    );
}
