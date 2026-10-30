import { FileText, Phone, Users } from 'lucide-react';
import { useTrans } from '@/hooks/use-trans';

type Step = { title: string; description: string };
export default function RecruitmentV2Steps({
    confirmation = false,
}: {
    confirmation?: boolean;
}) {
    const { tNode } = useTrans();
    const steps = tNode<Step[]>(
        confirmation ? 'recruitment_v2.next_steps' : 'recruitment_v2.steps',
        [],
    );
    const icons = [FileText, Users, Phone];

    return (
        <ol
            className={
                'recruitment-v2-steps' +
                (confirmation ? ' is-confirmation' : '')
            }
        >
            {steps.map((step, index) => {
                const Icon = icons[index % icons.length];

                return (
                    <li key={step.title}>
                        <span className="recruitment-v2-step-icon">
                            {confirmation ? (
                                <>
                                    <Icon size={32} aria-hidden="true" />
                                    <span>{index + 1}</span>
                                </>
                            ) : (
                                index + 1
                            )}
                        </span>
                        <div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
