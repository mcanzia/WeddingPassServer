<template>
  <div
    class="flex-1 mt-5 h-screen w-screen"
    v-if="selectedWedding"
  >
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">
          Invite User to {{ selectedWedding.name }}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <Label>User Role:</Label>
        <RadioGroup
          class="mt-2"
          v-model="selectedRole"
          default-value="editor"
        >
          <div
            class="flex items-center space-x-2"
            v-for="role in availableRoles"
            :key="role"
          >
            <RadioGroupItem
              :id="`radio-${role}`"
              :value="role"
            />
            <Label :for="`radio-${role}`">{{ startCase(role) }}</Label>
          </div>
        </RadioGroup>
        <Button
          class="mt-5"
          @click="generateInviteLink"
        >Generate Invite Link</Button>
        <div
          v-if="inviteLink"
          class="mt-4"
        >
          <Label>Invite Link:</Label>
          <div class="flex items-center mt-2">
            <Input
              id="invite-link"
              type="text"
              v-model="inviteLink"
              readonly
              class="flex-1 p-2 border rounded"
            />
            <Button
              @click="copyInviteLink"
              class="ml-2"
            >
              <ion-icon
                name="copy"
                class="w-5 h-5 mr-1"
              ></ion-icon>
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { storeToRefs } from "pinia";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { computed, ref } from "vue";
import { AuthService } from "@/services/AuthService";
import { WeddingRole } from "@/models/WeddingRole";
import { InviteToken } from "@/models/InviteToken";
import { Roles } from "@/models/Roles";
import { startCase } from "lodash";

const authService = new AuthService();
const { selectedWedding } = storeToRefs(useUserStore());

const inviteLink = ref<string | null>(null);
const selectedRole = ref("editor");
const copied = ref(false);

const availableRoles = computed(() => {
  return Object.values(Roles);
});

async function generateInviteLink() {
  const weddingRole: WeddingRole = new WeddingRole(
    selectedRole.value,
    selectedWedding.value!
  );
  const inviteToken: InviteToken = await authService.generateInviteLink(
    weddingRole
  );
  const baseUrl = window.location.origin;
  if (selectedRole.value === Roles.GUEST) {
    inviteLink.value = `${baseUrl}/invite?guest=true&token=${inviteToken.token}`;
  } else {
    inviteLink.value = `${baseUrl}/invite?token=${inviteToken.token}`;
  }
}

async function copyInviteLink() {
  if (inviteLink.value) {
    try {
      await navigator.clipboard.writeText(inviteLink.value);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
}
</script>