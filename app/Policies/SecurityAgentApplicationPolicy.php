<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\SecurityAgentApplication;
use App\Models\User;

class SecurityAgentApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('agent_applications');
    }

    public function view(User $user, SecurityAgentApplication $securityAgentApplication): bool
    {
        return $user->canAccessFeature('agent_applications');
    }

    public function update(User $user, SecurityAgentApplication $securityAgentApplication): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::AgentApplicationsUpdate);
    }
}
