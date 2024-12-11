<template>
    <Card class="w-full justify-self-center bg-[#fff7e7]">
        <CardHeader class="flex flex-col rounded-lg justify-self-center bg-[#fff7e7] w-full">
            <div class="m-4 space-y-1 text-center">
                <p class="font-bold text-2xl font-['Faculty_Glyphic']">Q&A</p>
            </div>

            <div class="m-4 space-y-1">
                <p class="font-bold">Is there a gifts registry?</p>
                <p>Your love and presence coming all the way to our wedding is our biggest present. We know that you'll
                    be spending plenty of time and money making your way there for us, and all that we would like to ask
                    for as we start this new chapter in our lives is to have you there to celebrate with us. PLEASE, NO
                    GIFTS!</p>
            </div>

            <div class="m-4 space-y-1">
                <p class="font-bold">Will you provide pickup and drop off?</p>
                <p class="text-base">We are happy to provide pickup from the airport/train station to the hotel on 27th
                    December, 2024 and drop off on 29th December, 2024 to UDR airport or Udaipur train station.</p>
            </div>

            <div class="m-4 space-y-1">
                <p class="font-bold">What will the weather be like?</p>
                <p class="text-base">The weather in Udaipur is very pleasant especially in the daytime during December,
                    especially if you're coming from abroad and are used to cooler temps at this time of year. With an
                    average high of 80°F (27°C) and a low of 50°F (10°C), it generally feels pleasantly warm with a
                    gentle breeze. It is warm during the day and the temperatures cool down at night, so bringing a
                    light jacket, shawl, or sweater is advised.</p>
            </div>

            <div class="m-4 space-y-1">
                <p class="font-bold">What should I know about passports and e-visas?</p>
                <p class="text-base">If traveling from outside of India, please make sure your passport is valid up to 6
                    months past our wedding date. If you don’t hold an Indian passport, an Indian E-Visa is needed for
                    entering the country and will be checked at customs. You can easily request one through the site
                    indianvisaonline.gov.in.</p>
            </div>

            <div class="m-4 space-y-1">
                <p class="font-bold">Are there any other things that I should know about?</p>
                <p class="text-base">Airport security in Indian airports tends to be very thorough and they will require
                    you to remove all cables, electronics (including electric toothbrushes!) and liquids from your
                    carry-on luggage when passing through the scanner. Sharp objects like nail scissors are also not
                    allowed on the flight, so please keep that in mind because they will be flagged and confiscated at
                    security. They are totally fine in checked bags. Here is a list of prohibited items:
                    www.aai.aero/en/airports/security-info/kullu-manali</p>
            </div>
            <div class="justify-items-center">
                <img src="/images/s-and-m.jpg" alt="Q&A Picture"
                    class="mt-1 w-auto h-auto max-w-xs object-contain align-self-center" />
            </div>
        </CardHeader>
    </Card>
</template>


<script setup lang="ts">
import { Card, CardHeader } from '@/components/ui/card';
</script>