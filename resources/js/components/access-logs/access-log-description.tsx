import type { ReactNode } from 'react';

type DescriptionSegment = {
    text: string;
    emphasis: 'none' | 'user' | 'action' | 'entity';
};

/** Verbe d'action en début de clause (après le nom d'utilisateur). */
const ACTION_VERB_PATTERN =
    /^(a\s+(?:modifié|créé|consulté|supprimé|ouvert|importé|ajouté|retiré|renvoyé|envoyé|demandé|effectué)|s'est\s+(?:connecté|déconnecté))/u;

/**
 * Découpe une phrase de journal : auteur · verbe · [texte liaison] · entité.
 * Seuls auteur, action et entité sont mis en avant — pas la phrase entière.
 */
export function parseAccessLogDescription(
    description: string,
    userName?: string | null,
): DescriptionSegment[] {
    if (description === '') {
        return [];
    }

    const segments: DescriptionSegment[] = [];
    let cursor = 0;

    const normalizedUser = userName?.trim() ?? '';

    if (normalizedUser !== '' && description.startsWith(normalizedUser)) {
        segments.push({ text: normalizedUser, emphasis: 'user' });
        cursor = normalizedUser.length;

        if (description[cursor] === ' ') {
            segments.push({ text: ' ', emphasis: 'none' });
            cursor += 1;
        }
    }

    const clause = description.slice(cursor);
    const hasTrailingDot = clause.endsWith('.');
    const clauseBody = hasTrailingDot ? clause.slice(0, -1) : clause;

    const actionMatch = clauseBody.match(ACTION_VERB_PATTERN);

    if (!actionMatch) {
        segments.push({ text: clause, emphasis: 'none' });

        return segments;
    }

    const action = actionMatch[0];
    segments.push({ text: action, emphasis: 'action' });

    let afterAction = clauseBody.slice(action.length);

    if (afterAction.startsWith(' ')) {
        segments.push({ text: ' ', emphasis: 'none' });
        afterAction = afterAction.slice(1);
    }

    const quoteIndex = afterAction.indexOf('«');

    if (quoteIndex >= 0) {
        const middle = afterAction.slice(0, quoteIndex);

        if (middle !== '') {
            segments.push({ text: middle, emphasis: 'none' });
        }

        const closingIndex = afterAction.indexOf('»', quoteIndex);

        if (closingIndex === -1) {
            segments.push({ text: afterAction.slice(quoteIndex), emphasis: 'none' });
        } else {
            segments.push({
                text: afterAction.slice(quoteIndex, closingIndex + 1),
                emphasis: 'entity',
            });

            const tail = afterAction.slice(closingIndex + 1);

            if (tail !== '') {
                segments.push({ text: tail, emphasis: 'none' });
            }
        }
    } else {
        const toEntityMatch = afterAction.match(/^(.+\sà\s+)(.+)$/u);

        if (toEntityMatch) {
            segments.push({ text: toEntityMatch[1], emphasis: 'none' });
            segments.push({ text: toEntityMatch[2], emphasis: 'entity' });
        } else if (afterAction !== '') {
            segments.push({ text: afterAction, emphasis: 'entity' });
        }
    }

    if (hasTrailingDot) {
        segments.push({ text: '.', emphasis: 'none' });
    }

    return segments;
}

function emphasisClass(emphasis: DescriptionSegment['emphasis']): string {
    switch (emphasis) {
        case 'user':
        case 'entity':
            return 'font-semibold text-foreground';
        case 'action':
            return 'font-medium text-foreground';
        default:
            return '';
    }
}

type AccessLogDescriptionProps = {
    description: string | null;
    fallback?: string;
    userName?: string | null;
    className?: string;
};

export function AccessLogDescription({
    description,
    fallback = '—',
    userName,
    className,
}: AccessLogDescriptionProps) {
    const text = description?.trim() ?? '';

    if (text === '') {
        return <span className={className}>{fallback}</span>;
    }

    const segments = parseAccessLogDescription(text, userName);

    return (
        <span className={className}>
            {segments.map((segment, index) => {
                if (segment.emphasis === 'none') {
                    return <span key={index}>{segment.text}</span>;
                }

                return (
                    <strong key={index} className={emphasisClass(segment.emphasis)}>
                        {segment.text}
                    </strong>
                );
            })}
        </span>
    );
}

export function renderAccessLogDescription(
    description: string | null,
    userName?: string | null,
    fallback = '—',
): ReactNode {
    return (
        <AccessLogDescription
            description={description}
            userName={userName}
            fallback={fallback}
        />
    );
}
