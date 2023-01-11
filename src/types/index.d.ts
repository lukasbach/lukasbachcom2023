declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module "*.yaml" {
    const content: {repo: string, category?: string, tags?: string }[]
    export default content;
}